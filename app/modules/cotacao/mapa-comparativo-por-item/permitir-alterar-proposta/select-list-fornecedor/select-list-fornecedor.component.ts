import { Component, OnInit, Input } from '@angular/core';
import { CategoriaProduto, CotacaoParticipante, PessoaJuridica, Situacao } from '@shared/models';
import { TranslationLibraryService, FornecedorService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'select-list-picker-fornecedor',
  templateUrl: './select-list-fornecedor.component.html',
  styleUrls: ['./select-list-fornecedor.component.scss']
})
export class SelectListFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-cotacao') idCotacao: number;
  @Input('label-origem') labelOrigem: string;
  @Input('label-destino') labelDestino: string;

  @Input() readonly: boolean = false;

  @Input('categorias') categoriasProduto: Array<CategoriaProduto> = new Array<CategoriaProduto>();

  @Input() set origem(value: Array<any>) {
    if (value) {
      this._participantesIncluidos = value;
    }
  }

  @Input() set destino(value: Array<any>) {
    if (value) {
      this._listaFornecedorSelecionado = value;
    }
  }

  public todosParticipantesIncluidosSelecionados: boolean = false;
  public todosparticipantesRemovidosSelecionados: boolean = false;

  private _listaFornecedorSelecionado: Array<any> = new Array<any>();
  private _participantesIncluidos: Array<CotacaoParticipante>;
  public participantesRemovidosSelecionados: Array<CotacaoParticipante> = new Array<
    CotacaoParticipante
  >();
  public participantesRemovidosBusca: Array<CotacaoParticipante>;
  public participantesIncluidosSelecionados: Array<CotacaoParticipante> = new Array<
    CotacaoParticipante
  >();
  public participantesIncluidosBusca: Array<CotacaoParticipante>;

  get listaFornecedorSelecionado(): Array<any> {
    return this._listaFornecedorSelecionado;
  }

  set listaFornecedorSelecionado(participantes: Array<any>) {
    this._listaFornecedorSelecionado = participantes;
    this.propagateChange(this._listaFornecedorSelecionado);
  }

  get participantesIncluidos(): Array<CotacaoParticipante> {
    return this._participantesIncluidos;
  }

  set participantesIncluidos(participantes: Array<CotacaoParticipante>) {
    this._participantesIncluidos = participantes;
    this.propagateChange(this._participantesIncluidos);
  }

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fornecedorService: FornecedorService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

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

  // #region Buscas
  public buscarParticipantesIncluidos(termo) {
    termo = termo.toLowerCase().trim();
    this.participantesIncluidosSelecionados = new Array<CotacaoParticipante>();
    this.todosParticipantesIncluidosSelecionados = false;
    if (termo != '')
      this.participantesIncluidosBusca = this.participantesIncluidos.filter(
        participante =>
          participante.pessoaJuridica.cnpj.toLowerCase().includes(termo) ||
          participante.pessoaJuridica.razaoSocial.toLowerCase().includes(termo)
      );
    else this.limparFiltroParticipantesIncluidos();
  }

  public limparFiltroParticipantesIncluidos() {
    this.participantesIncluidosBusca = null;
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
    if (termo != '')
      this.participantesRemovidosBusca = this.listaFornecedorSelecionado.filter(
        participante =>
          participante.pessoaJuridica.cnpj.toLowerCase().includes(termo) ||
          participante.pessoaJuridica.razaoSocial.toLowerCase().includes(termo)
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
      this.participantesIncluidos.splice(
        this.participantesIncluidos.findIndex(
          participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
        ),
        1
      );
      this.listaFornecedorSelecionado.push(cotacaoParticipante);
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

  public adicionar() {
    this.participantesRemovidosSelecionados.forEach(cotacaoParticipante => {
      this.participantesIncluidos = this.participantesIncluidos.concat(
        this.listaFornecedorSelecionado.splice(
          this.listaFornecedorSelecionado.findIndex(
            participante => participante.idPessoaJuridica === cotacaoParticipante.idPessoaJuridica
          ),
          1
        )
      );
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
      this.listaFornecedorSelecionado.forEach(participante => {
        if (
          this.exibirParticipanteDisponivel(participante) &&
          !this.participanteDisponivelSelecionado(participante)
        )
          this.participantesRemovidosSelecionados.push(participante);
      });
    }
  }
}
