import { Component, OnInit, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  CategoriaProduto,
  CotacaoParticipante,
  Situacao,
  PessoaJuridica,
  Estado,
  Cotacao,
  SituacaoCotacao
} from '@shared/models';
import { TranslationLibraryService, FornecedorService, EstadoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IncluirFornecedorComponent } from './incluir-fornecedor/incluir-fornecedor.component';
import { ListarAnexosParticipantesComponent } from './listar-anexos-participantes/listar-anexos-participantes.component';

@Component({
  selector: 'manter-cotacao-participantes',
  templateUrl: './manter-cotacao-participantes.component.html',
  styleUrls: ['./manter-cotacao-participantes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManterCotacaoParticipantesComponent),
      multi: true
    }
  ]
})
export class ManterCotacaoParticipantesComponent implements OnInit, ControlValueAccessor {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-cotacao') idCotacao: number;
  @Input('cotacao') cotacao: Cotacao;
  @Input('categorias') categoriasProduto: Array<CategoriaProduto> = new Array<CategoriaProduto>();
  @Input('participantes') participantes: Array<PessoaJuridica> = new Array<PessoaJuridica>();
  @Input() readonly: boolean = false;

  public situacaoCotacao = SituacaoCotacao;

  private _participantesIncluidos: Array<CotacaoParticipante>;

  get participantesIncluidos(): Array<CotacaoParticipante> {
    return this._participantesIncluidos;
  }

  set participantesIncluidos(participantes: Array<CotacaoParticipante>) {
    this._participantesIncluidos = participantes;
    this.propagateChange(this._participantesIncluidos);
  }

  public participantesRemovidos: Array<CotacaoParticipante> = new Array<CotacaoParticipante>();
  public participantesRemovidosSelecionados: Array<CotacaoParticipante> = new Array<CotacaoParticipante>();
  public participantesRemovidosBusca: Array<CotacaoParticipante>;

  public participantesIncluidosSelecionados: Array<CotacaoParticipante> = new Array<CotacaoParticipante>();
  public participantesIncluidosBusca: Array<CotacaoParticipante>;

  private idPais = 30; //Brasil
  public estados: Array<Estado>;
  public estadosBuscaIncluidos = new Array<string>();
  public estadosBuscaRemovidos = new Array<string>();

  public tipoVisualizacao = null;
  public termoFornecedorCotacaoConfigurada: string;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService,
    private modalService: NgbModal,
    private estadoService: EstadoService
  ) {}

  ngOnInit() {
    if (this.participantes) this.preencherCotacaoParticipantes(this.participantes);
    else this.obterParticipantes();
  }

  // #region ControlValue Methods
  writeValue(obj: any): void {
    this.participantesIncluidos = obj;
  }

  propagateChange = (_: any) => {};

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {}

  setDisabledState?(isDisabled: boolean): void {}
  // #endregion

  private obterParticipantes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .obterEmpresasFornecedorasPorCategorias(
        this.categoriasProduto
          .map(categoria => {
            return categoria.idCategoriaProduto.toString();
          })
          .join(',')
      )
      .subscribe(
        response => {
          if (response) this.preencherCotacaoParticipantes(response);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  private preencherCotacaoParticipantes(fornecedores: Array<PessoaJuridica>) {
    let participantes = fornecedores.map(fornecedor => {
      return new CotacaoParticipante(
        0,
        this.idCotacao,
        moment().format(),
        fornecedor.idPessoaJuridica,
        fornecedor,
        Situacao.Ativo,
        false,
        fornecedor.categoriasProduto
      );
    });

    if (!this.idCotacao && !this.participantesIncluidos.length) {
      this.participantesIncluidos = participantes;
    } else {
      this.participantesIncluidos = participantes;
      this.participantesIncluidos = this.participantesIncluidos.filter(participante =>
        participante.categoriasProduto
          .map(categoria => {
            return categoria.idCategoriaProduto;
          })
          .find(idCategoria =>
            this.categoriasProduto
              .map(categoria => categoria.idCategoriaProduto)
              .includes(idCategoria)
          )
      );
      this.participantesRemovidos = participantes.filter(
        participante =>
          !this.participantesIncluidos
            .map(p => {
              return p.idPessoaJuridica;
            })
            .includes(participante.idPessoaJuridica)
      );
    }
  }

  // #region Buscas
  public buscarParticipantesIncluidos(termo) {
    termo = termo.toLowerCase().trim();
    this.participantesIncluidosSelecionados = new Array<CotacaoParticipante>();
    this.todosParticipantesIncluidosSelecionados = false;
    if (termo != '' || this.estadosBuscaIncluidos.length)
      this.participantesIncluidosBusca = this.participantesIncluidos.filter(
        participante =>
          this.buscarPorNome(termo, participante) && this.buscarPorEstado(participante)
      );
    else this.limparFiltroParticipantesIncluidos();
  }

  public buscarParticipantesIncluidosCotacaoConfigurada() {
    let termo = this.termoFornecedorCotacaoConfigurada
      ? this.termoFornecedorCotacaoConfigurada.toLowerCase().trim()
      : '';
    this.participantesIncluidosSelecionados = new Array<CotacaoParticipante>();
    this.todosParticipantesIncluidosSelecionados = false;
    if (termo != '' || this.estadosBuscaIncluidos.length || this.tipoVisualizacao)
      this.participantesIncluidosBusca = this.participantesIncluidos.filter(
        participante =>
          this.buscarPorNome(termo, participante) &&
          this.buscarPorEstado(participante) &&
          this.buscarPorVisualizacao(participante)
      );
    else this.limparFiltroParticipantesIncluidos();
  }

  private buscarPorNome(termo: string, participante: CotacaoParticipante) {
    return (
      participante.pessoaJuridica.cnpj.toLowerCase().includes(termo) ||
      participante.pessoaJuridica.cnpj.toLowerCase().replace(/\D/g, '').includes(termo) ||
      participante.pessoaJuridica.razaoSocial.toLowerCase().includes(termo) ||
      (participante.pessoaJuridica.nomeFantasia &&
        participante.pessoaJuridica.nomeFantasia.toLowerCase().includes(termo)) ||
      (participante.pessoaJuridica.codigoFornecedor &&
        participante.pessoaJuridica.codigoFornecedor.toLowerCase().includes(termo))
    );
  }

  private buscarPorEstado(participante: CotacaoParticipante) {
    return (
      this.estadosBuscaIncluidos.includes(
        participante.pessoaJuridica.abreviacaoUnidadeFederativa
      ) || !this.estadosBuscaIncluidos.length
    );
  }

  private buscarPorVisualizacao(participante: CotacaoParticipante) {
    switch (this.tipoVisualizacao) {
      case 1:
        return participante.nomeUsuarioVisualizouCotacaoRodadaAtual == null;
      case 2:
        return (
          participante.nomeUsuarioVisualizouCotacaoRodadaAtual != null &&
          participante.dataEnvioPropostaCotacaoRodadaAtual == null
        );
      case 3:
        return participante.dataEnvioPropostaCotacaoRodadaAtual != null;
      default:
        return true;
    }
  }

  public limparFiltroParticipantesIncluidos() {
    this.participantesIncluidosBusca = null;
    this.tipoVisualizacao = null;
    this.estadosBuscaIncluidos = [];
  }

  public exibirParticipanteIncluido(cotacaoParticipante: CotacaoParticipante): boolean {
    return (
      !this.participantesIncluidosBusca ||
      this.participantesIncluidosBusca.findIndex(
        participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
      ) != -1
    );
  }

  public buscarparticipantesRemovidos(termo) {
    termo = termo.toLowerCase().trim();
    this.participantesRemovidosSelecionados = new Array<CotacaoParticipante>();
    this.todosparticipantesRemovidosSelecionados = false;
    if (termo != '' || this.estadosBuscaRemovidos.length)
      this.participantesRemovidosBusca = this.participantesRemovidos.filter(
        participante =>
          this.buscarPorNome(termo, participante) && this.buscarPorEstado(participante)
      );
    else this.limparFiltroparticipantesRemovidos();
  }

  public limparFiltroparticipantesRemovidos() {
    this.participantesRemovidosBusca = null;
  }

  public exibirParticipanteDisponivel(cotacaoParticipante: CotacaoParticipante): boolean {
    return (
      !this.participantesRemovidosBusca ||
      this.participantesRemovidosBusca.findIndex(
        participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
      ) != -1
    );
  }
  // #endregion

  public remover() {
    this.participantesIncluidosSelecionados.forEach(cotacaoParticipante => {
      this.participantesRemovidos = this.participantesRemovidos.concat(
        this.participantesIncluidos.splice(
          this.participantesIncluidos.findIndex(
            participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
          ),
          1
        )
      );
      this.participantesIncluidosSelecionados = new Array<CotacaoParticipante>();
      this.todosParticipantesIncluidosSelecionados = false;
    });
  }

  public selecionarParticipanteIncluido(cotacaoParticipante: CotacaoParticipante) {
    if (this.participanteIncluidoSelecionado(cotacaoParticipante)) {
      this.participantesIncluidosSelecionados.splice(
        this.participantesIncluidosSelecionados.findIndex(
          participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
        ),
        1
      );
      this.todosParticipantesIncluidosSelecionados = false;
    } else this.participantesIncluidosSelecionados.push(cotacaoParticipante);
  }

  public participanteIncluidoSelecionado(cotacaoParticipante: CotacaoParticipante): boolean {
    return (
      this.participantesIncluidosSelecionados.findIndex(
        participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
      ) != -1
    );
  }

  public selecionarTodosIncluidos() {
    if (this.todosParticipantesIncluidosSelecionados) {
      this.todosParticipantesIncluidosSelecionados = false;
      this.participantesIncluidosSelecionados = new Array<CotacaoParticipante>();
    } else {
      this.todosParticipantesIncluidosSelecionados = true;
      this.participantesIncluidos.forEach(participante => {
        if (
          this.exibirParticipanteIncluido(participante) &&
          !this.participanteIncluidoSelecionado(participante)
        )
          this.participantesIncluidosSelecionados.push(participante);
      });
    }
  }

  public todosParticipantesIncluidosSelecionados: boolean = false;

  public adicionar() {
    this.participantesRemovidosSelecionados.forEach(cotacaoParticipante => {
      let participanteExistente = this.participantesIncluidos.filter(
        p => p.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
      );

      if (participanteExistente.length > 0) {
        let idsCategoriasExistentes = participanteExistente[0].categoriasProduto.map(
          c => c.idCategoriaProduto
        );
        let categoriasNova = cotacaoParticipante.categoriasProduto;

        categoriasNova.forEach(categoria => {
          let existeCategoria = idsCategoriasExistentes.includes(categoria.idCategoriaProduto);
          if (!existeCategoria) {
            participanteExistente[0].categoriasProduto.push(categoria);
          }
        });
        this.participantesRemovidos.splice(
          this.participantesRemovidos.findIndex(
            participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
          ),
          1
        );
      } else {
        this.participantesIncluidos = this.participantesIncluidos.concat(
          this.participantesRemovidos.splice(
            this.participantesRemovidos.findIndex(
              participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
            ),
            1
          )
        );
      }
      this.participantesRemovidosSelecionados = new Array<CotacaoParticipante>();
      this.todosparticipantesRemovidosSelecionados = false;
    });
  }

  public selecionarParticipanteDisponivel(cotacaoParticipante: CotacaoParticipante) {
    if (this.participanteDisponivelSelecionado(cotacaoParticipante)) {
      this.participantesRemovidosSelecionados.splice(
        this.participantesRemovidosSelecionados.findIndex(
          participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
        ),
        1
      );
      this.todosparticipantesRemovidosSelecionados = false;
    } else this.participantesRemovidosSelecionados.push(cotacaoParticipante);
  }

  public participanteDisponivelSelecionado(cotacaoParticipante: CotacaoParticipante): boolean {
    return (
      this.participantesRemovidosSelecionados.findIndex(
        participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
      ) != -1
    );
  }

  public selecionarTodosDisponiveis() {
    if (this.todosparticipantesRemovidosSelecionados) {
      this.todosparticipantesRemovidosSelecionados = false;
      this.participantesRemovidosSelecionados = new Array<CotacaoParticipante>();
    } else {
      this.todosparticipantesRemovidosSelecionados = true;
      this.participantesRemovidos.forEach(participante => {
        if (
          this.exibirParticipanteDisponivel(participante) &&
          !this.participanteDisponivelSelecionado(participante)
        )
          this.participantesRemovidosSelecionados.push(participante);
      });
    }
  }

  public todosparticipantesRemovidosSelecionados: boolean = false;

  public abrirModalSelecaoFornecedor() {
    const modalRef = this.modalService.open(IncluirFornecedorComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.fornecedoresParticipantes = this.participantesIncluidos;
    modalRef.componentInstance.categoriasProduto = this.categoriasProduto;
    modalRef.result.then(result => {
      if (result) {
        let cotacaoParticipante: CotacaoParticipante = new CotacaoParticipante(
          0,
          this.idCotacao,
          moment().format(),
          result.idPessoaJuridica,
          result,
          Situacao.Ativo,
          false,
          result.categoriasProduto
        );

        let participanteExistente = this.participantesIncluidos.filter(
          p => p.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
        );

        if (participanteExistente.length > 0) {
          let idsCategoriasExistentes = participanteExistente[0].categoriasProduto.map(
            c => c.idCategoriaProduto
          );
          let categoriasNova = cotacaoParticipante.categoriasProduto;
          categoriasNova.forEach(categoria => {
            let existeCategoria = idsCategoriasExistentes.includes(categoria.idCategoriaProduto);
            if (!existeCategoria) {
              participanteExistente[0].categoriasProduto.push(categoria);
            }
          });
        } else {
          this.participantesIncluidos = this.participantesIncluidos.concat(cotacaoParticipante);
        }
      }
    });
  }

  public obterEstados() {
    if (!this.estados) {
      this.estadoService.obterEstados(this.idPais).subscribe(
        response => {
          if (response) {
            this.estados = response;
          } else {
            this.estados = new Array<Estado>();
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      );
    }
  }

  public visualizarAnexos(participante: PessoaJuridica) {
    const modalRef = this.modalService.open(ListarAnexosParticipantesComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });

    if (participante) {
      modalRef.componentInstance.idCotacao = this.cotacao.idCotacao;
      modalRef.componentInstance.idTenant = participante.idTenant;
      modalRef.componentInstance.razaoSocial = participante.razaoSocial;
      modalRef.componentInstance.cnpj = participante.cnpj;
    }
  }
}
