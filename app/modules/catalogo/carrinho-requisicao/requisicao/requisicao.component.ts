import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Arquivo, CentroCusto, Cidade, CondicaoPagamento, ContaContabil, Departamento, Endereco, Estado, GrupoCompradores, Paginacao, Requisicao, SlaItem, TipoEndereco, TipoRequisicao, UnidadeMedidaTempo, Usuario } from '@shared/models';
import { RequisicaoItem } from '@shared/models/requisicao/requisicao-item';
import { AutenticacaoService, EnderecoService, MatrizResponsabilidadeService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, concat } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ResumoCarrinhoComponent } from 'src/app/modules/container/resumo-carrinho/resumo-carrinho.component';
import { SmkConfirmacaoComponent } from '../../../../shared/components/modals/smk-confirmacao/smk-confirmacao.component';
import { Alcada } from '../../../../shared/models/alcada';
import { ContaContabilDto } from '../../../../shared/models/dto/conta-contabil-dto';
import { TipoAlcadaAprovacao } from '../../../../shared/models/enums/tipo-alcada-aprovacao';
import { EnderecoFiltro } from '../../../../shared/models/fltros/endereco-filtro';
import { RequisicaoAnexo } from '../../../../shared/models/requisicao/requisicao-anexo';
import { RequisicaoService } from '../../../../shared/providers/requisicao.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { UtilitiesService } from '../../../../shared/utils/utilities.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.scss'],
})
export class RequisicaoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() requisicao: Requisicao;
  @Input() indexPai: number;
  @Input() todasAsEmpresasPossuemIntegracaoErp: boolean;

  @Input() centrosDeCusto: Array<CentroCusto>;
  @Input() centrosDeCustoLoading: boolean;
  @Input() centroDeCustoUnico: boolean;

  @Input() alcadas: Array<Alcada>;
  @Input() alcadasLoading: boolean;
  @Input() alcadaUnica: boolean;

  @Input() condicoesPagamento: Array<CondicaoPagamento>;
  @Input() condicoesPagamentoLoading: boolean;

  @Input() tiposRequisicao: Array<TipoRequisicao>;
  @Input() tiposRequisicaoLoading: boolean;
  @Input() tipoRequisicaoUnico: boolean;
  @Input() tipoRequisicaoUnicoLoadedEvent: Observable<TipoRequisicao>;

  @Input() gruposCompradores: Array<GrupoCompradores>;
  @Input() gruposCompradoresLoading: boolean;
  @Input() grupoCompradoresUnico: boolean;

  @Input() contasContabeis$: Observable<Array<ContaContabilDto>>;
  @Input() contasContabeisLoading: boolean;
  @Input() contaContabilUnica: boolean;
  @Input() contasContabeisInput$ = new Subject<string>();

  @Input() departamentos: Array<Departamento>;
  @Input() departamentosLoading: boolean;
  @Input() departamentoUnico: boolean;

  @Input() textoNgSelectLoading: string;
  @Input() textoNgSelectLimpar: string;
  @Input() textoNgSelectPlaceholder: string;

  // tslint:disable-next-line: no-output-rename
  @Output('item-alterado') itemAlterado = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('atualizar-carrinho') atualizarCarrinho = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('remover') removerEvent: EventEmitter<Requisicao> = new EventEmitter<Requisicao>();
  @Output('removerItens') removerItensEvent: EventEmitter<Array<RequisicaoItem>> = new EventEmitter<Array<RequisicaoItem>>();

  usuarioAtual: Usuario;
  departamentoRequired: boolean = false;

  enderecos$: Observable<Array<Endereco>>;
  enderecosLoading: boolean;
  enderecoUnico: boolean;
  enderecosInput$ = new Subject<string>();
  enderecoSelecionado: Endereco;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;

  slaItens: Array<SlaItem>;
  slaItensLoading: boolean;
  slaItensUnico: boolean;

  TipoEndereco = TipoEndereco;
  UnidadeMedidaTempo = UnidadeMedidaTempo;

  contaContabilSelecionada: ContaContabilDto;

  isListaExtensaEnderecos: boolean;

  enderecoFiltro: EnderecoFiltro = new EnderecoFiltro();

  mostrarCampoDepartamento: boolean;

  constructor(
    private requisicaoService: RequisicaoService,
    private translationLibrary: TranslationLibraryService,
    private enderecoService: EnderecoService,
    private matrizService: MatrizResponsabilidadeService,
    private authService: AutenticacaoService,
    private errorService: ErrorService,
    private toastr: ToastrService,
    private utilitiesService: UtilitiesService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.usuarioAtual = this.authService.usuario();
    this.tipoAlcadaAprovacao = this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
    this.mostrarCampoDepartamento = this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarDepartamentoRequisicao;

    this.isListaExtensaEnderecos = this.requisicao.empresaSolicitante.listaExtensaEnderecos;

    this.populeEnderecos();

    if(this.usuarioAtual.permissaoAtual.pessoaJuridica.habilitarDepartamentoRequisicao){
      this.departamentoRequired = true;
    }

    if (this.requisicao.idTipoRequisicao) {
      this.populeItensSla(this.requisicao.idTipoRequisicao);
    }

    if (this.requisicao.contaContabil) {
      this.contaContabilSelecionada = new ContaContabilDto({
        idContaContabil: this.requisicao.idContaContabil,
        codigo: this.requisicao.contaContabil.codigo,
        descricao: this.requisicao.contaContabil.descricao,
      });
    } else {
      this.requisicao.contaContabil = new ContaContabil();
    }

    // Evento disparado quando o component pai (carrinho-requisicao.component) carrega o tipo de requisição único.
    this.tipoRequisicaoUnicoLoadedEvent.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((tipoRequisicao) => {
        if (tipoRequisicao && tipoRequisicao.idTipoRequisicao !== this.requisicao.idTipoRequisicao) {
          this.requisicao.idTipoRequisicao = tipoRequisicao.idTipoRequisicao;
          this.requisicao.tipoRequisicao = tipoRequisicao;
          this.populeItensSla(tipoRequisicao.idTipoRequisicao);
        }
      });

    if (this.requisicao.enderecoEntrega) {
      this.enderecoSelecionado = this.requisicao.enderecoEntrega;
    } else {
      this.requisicao.enderecoEntrega = {} as Endereco;
    }

    this.blockUI.stop();
  }

  addLista(requisicaoItem: RequisicaoItem) {
    requisicaoItem.idRequisicaoItem = 0;
    this.blockUI.start();

    this.requisicaoService.inserirItem(requisicaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            requisicaoItem.idRequisicaoItem = response.item.idRequisicaoItem;
            requisicaoItem.ultimaAlteracao = moment().format();
            this.requisicao.itens.push(requisicaoItem);
            this.atualizarResumoCarrinho();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.blockUI.stop();
          this.errorService.treatError(error);
        },
      );
  }

  removerItem(requisicaoItem: RequisicaoItem) {
    const index = this.requisicao.itens.indexOf(requisicaoItem);
    if (index > -1) {
      this.requisicao.itens.splice(index, 1);

      if (this.requisicao.itens.length === 0) {
        this.removerEvent.emit(this.requisicao);
      }
    }
  }


  removerItens() {
    const itensSelecionados = this.requisicao.itens.filter((item) => item.selecionado);
    if (itensSelecionados.length > 0) {
      const modalRef = this.modalService.open(SmkConfirmacaoComponent, { centered: true })
      modalRef.componentInstance.conteudo = 'Deseja Excluir os itens selecionados ? ';
      modalRef.componentInstance.titulo = 'Atenção';

      modalRef.result.then(
        async (result) => {

          if (result) {
            this.blockUI.start();
            this.requisicaoService.deletarItens(itensSelecionados).pipe(
              takeUntil(this.unsubscribe))
              .subscribe(
                (response) => {
                  if (response && response > 0) {
                    itensSelecionados.forEach(item => {
                      const index = this.requisicao.itens.indexOf(item);
                      if (index > -1) {
                        this.requisicao.itens.splice(index, 1);
                      }
                    });
                    this.requisicao.selecionarTodos = false;
                    ResumoCarrinhoComponent.atualizarCarrinho.next();
                    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    this.atualizarCarrinho.emit();
                    this.removerItensEvent.emit(itensSelecionados);
                  } else {
                    this.toastr.error('Falha ao remover item.');
                  }
                  this.blockUI.stop();
                },
                () => {
                  this.blockUI.stop();
                  this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
                },
              );
          }
        },
        (reason) => { },
      );
    }
  }

  selecionarTodos(event, requisicao: Requisicao) {
    requisicao.habilitarBtnRemover = event.target.checked;
    requisicao.itens.forEach((p) => {
      return p.selecionado = event.target.checked;
    });
  }

  itemSelecionado(itemSelecionado: RequisicaoItem) {
    this.requisicao.selecionarTodos = false;
    const selecionados = this.requisicao.itens.filter((p) => p.selecionado);
    this.requisicao.habilitarBtnRemover = selecionados.length > 0;

    if (selecionados.length === this.requisicao.itens.length) {
      this.requisicao.selecionarTodos = true;
    }

  }

  atualizarResumoCarrinho() {
    this.atualizarCarrinho.emit();
  }

  alterarRequisicao() {
    let status = 'salvando';

    this.requisicao.ultimaAlteracao = status;
    this.itemAlterado.emit(status);

    this.requisicaoService.alterarDadosComuns(this.requisicao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.requisicao.itens.forEach((item) => {
              item.idEnderecoEntrega = this.requisicao.idEnderecoEntrega;
              item.idCentroCusto = this.requisicao.idCentroCusto;
              item.idCondicaoPagamento = this.requisicao.idCondicaoPagamento;
              item.idSlaItem = this.requisicao.idSlaItem;
              item.idTipoRequisicao = this.requisicao.idTipoRequisicao;
              item.idGrupoCompradores = this.requisicao.idGrupoCompradores;
              item.idContaContabil = this.requisicao.idContaContabil;

              this.requisicaoService.alterarItem(item).pipe(
                takeUntil(this.unsubscribe),
                finalize(() => this.itemAlterado.emit()))
                .subscribe();
            });

            this.requisicao.ultimaAlteracao = moment().format();
            ResumoCarrinhoComponent.atualizarCarrinho.next();
          }
        },
        (error) => {
          status = 'erro';

          this.requisicao.ultimaAlteracao = status;
          this.itemAlterado.emit(status);
        },
      );
  }

  alterarTipoRequisicao(idTipoRequisicao: number) {
    this.requisicao.idSlaItem = null;

    if (idTipoRequisicao) {
      this.populeItensSla(idTipoRequisicao);
    } else {
      this.slaItens = new Array<SlaItem>();
    }
  }

  atualizarAlteracao(event) {
    this.requisicao.ultimaAlteracao = event;
    this.itemAlterado.emit(event);
  }

  contaContabilChange(contaContabilSelecionada: ContaContabilDto) {
    if (contaContabilSelecionada) {
      this.requisicao.idContaContabil = contaContabilSelecionada.idContaContabil;
      this.requisicao.contaContabil.codigo = contaContabilSelecionada.codigo;
      this.requisicao.contaContabil.descricao = contaContabilSelecionada.descricao;
    } else {
      this.requisicao.idContaContabil = null;
      this.requisicao.contaContabil.codigo = null;
      this.requisicao.contaContabil.descricao = null;
    }

    this.alterarRequisicao();
  }

  insiraAnexos(arquivos: Array<Arquivo>) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.requisicaoService.postAnexos(this.requisicao.idRequisicao, arquivos).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.obtenhaAnexos();
        },
        (error) => this.errorService.treatError(error),
      );
  }

  excluaAnexo(requisicaoAnexo: RequisicaoAnexo) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.requisicaoService.deleteAnexos(requisicaoAnexo.idRequisicaoAnexo).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        () => {
          this.obtenhaAnexos();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => {
          if (error && error.status === 304) {
            this.obtenhaAnexos();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        });
  }

  enderecoSearchFn(term: string, item: Endereco) {
    term = term.toLowerCase();
    return (
      item.logradouro.toLowerCase().indexOf(term) > -1 ||
      item.bairro.toLowerCase().indexOf(term) > -1 ||
      item.cidade.nome.toLowerCase().indexOf(term) > -1 ||
      item.cidade.estado.nome.toLowerCase().indexOf(term) > -1 ||
      item.cidade.estado.abreviacao.toLowerCase().indexOf(term) > -1 ||
      item.cep.toLowerCase().indexOf(term) > -1
    );
  }

  enderecoChange(enderecoSelecionado: Endereco) {
    if (enderecoSelecionado) {
      this.requisicao.idEnderecoEntrega = enderecoSelecionado.idEndereco;
      this.requisicao.enderecoEntrega = {} as Endereco;
      this.requisicao.enderecoEntrega.logradouro = enderecoSelecionado.logradouro;
      this.requisicao.enderecoEntrega.numero = enderecoSelecionado.numero;
      this.requisicao.enderecoEntrega.bairro = enderecoSelecionado.bairro;
      this.requisicao.enderecoEntrega.cep = enderecoSelecionado.cep;

      this.requisicao.enderecoEntrega.cidade = new Cidade({
        nome: enderecoSelecionado.cidade.nome,
        estado: new Estado({
          abreviacao: enderecoSelecionado.cidade.estado.abreviacao,
        }),
      });
    } else {
      this.requisicao.idEnderecoEntrega = null;
      this.requisicao.enderecoEntrega = null;
    }

    this.alterarRequisicao();
  }

  private populeEnderecos() {
    if (this.isListaExtensaEnderecos) {
      this.obtenhaListaExtensaEnderecos();
    } else {
      this.obtenhaListaSimplesEnderecos();
    }
  }

  private obtenhaListaSimplesEnderecos(): void {
    this.enderecosLoading = true;
    const idPessoa = this.requisicao.empresaSolicitante.idPessoa;
    this.enderecos$ = this.enderecoService.listar(idPessoa).pipe(
      takeUntil(this.unsubscribe),
      map((enderecos) => enderecos.filter((t) => t.tipo === TipoEndereco.Entrega)),
      tap((enderecos) => {
        if (enderecos && enderecos.length === 1) {
          const endereco = enderecos[0];

          this.requisicao.idEnderecoEntrega = endereco.idEndereco;
          this.requisicao.enderecoEntrega = endereco;
          this.enderecoUnico = true;
        }
      }),
      finalize(() => this.enderecosLoading = false));
  }

  private obtenhaListaExtensaEnderecos(): void {
    const idPessoa = this.requisicao.empresaSolicitante.idPessoa;
    this.enderecos$ = concat(
      this.utilitiesService.getObservable(new Array<Endereco>()),
      this.enderecosInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.enderecosLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.enderecoFiltro.idPessoa = idPessoa;
          this.enderecoFiltro.itensPorPagina = 20;
          this.enderecoFiltro.pagina = 1;
          this.enderecoFiltro.termo = termoDeBusca;
          this.enderecoFiltro.tipoEndereco = TipoEndereco.Entrega;
          return this.enderecoService.filtrarPorPessoa(this.enderecoFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.enderecosLoading = false)),
            map((paginacao: Paginacao<Endereco>) => paginacao ? paginacao.itens : new Array<Endereco>()),
            catchError(() => this.utilitiesService.getObservable(new Array<Endereco>())),
          );
        }),
      ),
    );
  }

  private populeItensSla(idTipoRequisicao: number) {
    this.slaItensLoading = true;

    this.matrizService.obterPorCategoriaTipoRequisicao(this.requisicao.idCategoriaProduto, idTipoRequisicao).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.slaItensLoading = false))
      .subscribe(
        (response) => {
          if (response) {
            this.slaItens = response.slaItens;

            if (this.slaItens && this.slaItens.length === 1) {
              const slaItem = this.slaItens[0];

              this.requisicao.idSlaItem = slaItem.idSlaItem;
              this.requisicao.slaItem = slaItem;
              this.slaItensUnico = true;
            }
          }
        });
  }

  private obtenhaAnexos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.requisicaoService.getAnexos(this.requisicao.idRequisicao).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (requisicaoAnexos) => {
          if (requisicaoAnexos) {
            this.processeAnexos(requisicaoAnexos);
          } else {
            this.requisicao.anexos = new Array<RequisicaoAnexo>();
          }
        }, () => this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR),
      );
  }

  private processeAnexos(requisicaoAnexos: Array<RequisicaoAnexo>): void {
    this.requisicao.anexos = requisicaoAnexos.map((requisicaoAnexo: RequisicaoAnexo) => ({ ...requisicaoAnexo, permiteExcluir: true }));
  }

  imobilizadoChange(event: any) {
    this.requisicao.codigoImobilizado = event.target.value;
  }

}
