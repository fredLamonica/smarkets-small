import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoCatalogoItem, ContratoCatalogoParticipante, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacaoExclusao } from '../../../../shared/components';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ContratoCatalogoParticipanteItemFiltro } from '../../../../shared/models/fltros/contrato-catalogo-participante-item-filtro';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { VincularProdutoItemParticipanteComponent } from './vincular-produto-item-participante/vincular-produto-item-participante.component';

@Component({
  selector: 'smk-vincular-item-participante-contrato',
  templateUrl: './vincular-item-participante-contrato.component.html',
  styleUrls: ['./vincular-item-participante-contrato.component.scss'],
})
export class VincularItemParticipanteContratoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;
  // tslint:disable-next-line: no-input-rename
  @Input('participante') participante: ContratoCatalogoParticipante;

  Situacao = SituacaoContratoCatalogoItem;

  settings: CustomTableSettings;
  itens: Array<ContratoCatalogoItem>;
  selecionados: Array<ContratoCatalogoItem>;

  registrosPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  itemOrdenar: string = 'cci.IdContratoCatalogoItem';
  ordenacao: Ordenacao = Ordenacao.DESC;
  contratoCatalogoParticipanteItemFiltro: ContratoCatalogoParticipanteItemFiltro = new ContratoCatalogoParticipanteItemFiltro();

  // #region Edição de Participante Item
  modalRef: any;

  form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private errorService: ErrorService,
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    this.construirTabelas();
    this.obterItens();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Produto', 'produto.descricao', CustomTableColumnType.text),
        new CustomTableColumn('Un. Medida', 'produto.unidadeMedida.descricao', CustomTableColumnType.text),
        new CustomTableColumn('Categoria', 'produto.categoria.nome', CustomTableColumnType.text),
        new CustomTableColumn('Valor', 'valor', CustomTableColumnType.text),
        new CustomTableColumn('Situação', 'situacao', CustomTableColumnType.enum, null, null, SituacaoContratoCatalogoItem, 'cci.situacao'),
      ],
      'check',
    );
  }

  selecao(itens: Array<ContratoCatalogoItem>) {
    this.selecionados = itens;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterItens('');
  }

  cancelar() {
    this.activeModal.close();
  }

  atualizarItens(event) {
    this.itens.push(event);
  }

  cancelarEdicao() {
    this.modalRef.close();
  }
  // #endregion

  AdicionarProdutos() {
    const modalRef = this.modalService.open(VincularProdutoItemParticipanteComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.componentInstance.participante = this.participante;

    modalRef.result.then((result) => {
      if (result) {
        this.obterItens();
      }
    });
  }

  RemoverItens() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }

  private obterItens(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoCatalogoParticipanteItemFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoParticipanteItemFiltro.itensPorPagina = this.registrosPorPagina;
    this.contratoCatalogoParticipanteItemFiltro.pagina = this.pagina;
    this.contratoCatalogoParticipanteItemFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoParticipanteItemFiltro.termo = termo;
    this.contratoCatalogoParticipanteItemFiltro.idContratoCatalogoParticipante = this.participante.idContratoCatalogoParticipante;

    this.contratoService
      .ListeVinculoItensParticipante(this.contratoCatalogoParticipanteItemFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.itens = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itens = new Array<ContratoCatalogoItem>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoService.deletarItensVinculoParticipante(this.participante.idContratoCatalogoParticipante, this.selecionados)
      .subscribe((resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.obterItens();
      }, (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      });
  }

}
