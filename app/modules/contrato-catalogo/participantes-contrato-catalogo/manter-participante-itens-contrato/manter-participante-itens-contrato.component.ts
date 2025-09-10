import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoCatalogoParticipante, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, SituacaoContratoCatalogoItem, Usuario } from '@shared/models';
import { ContratoCatalogoParticipanteItem } from '@shared/models/contrato-catalogo/contrato-catalogo-participante-item';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { Alcada } from '../../../../shared/models/alcada';
import { TipoAlcadaAprovacao } from '../../../../shared/models/enums/tipo-alcada-aprovacao';
import { ContratoCatalogoParticipanteItemFiltro } from '../../../../shared/models/fltros/contrato-catalogo-participante-item-filtro';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ProdutosItensParticipanteComponent } from '../produtos-itens-participante/produtos-itens-participante.component';

@Component({
  selector: 'app-manter-participante-itens-contrato',
  templateUrl: './manter-participante-itens-contrato.component.html',
  styleUrls: ['./manter-participante-itens-contrato.component.scss'],
})
export class ManterParticipanteItensContratoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;
  // tslint:disable-next-line: no-input-rename
  @Input('participante') participante: ContratoCatalogoParticipante;

  Situacao = SituacaoContratoCatalogoItem;

  settings: CustomTableSettings;
  itens: Array<ContratoCatalogoParticipanteItem>;
  selecionados: Array<ContratoCatalogoParticipanteItem>;

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;
  alcada: Alcada;
  idAlcada: number;
  usuarioAtual: Usuario;

  registrosPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  itemOrdenar: string = 'cci.IdContratoCatalogoItem';
  ordenacao: Ordenacao = Ordenacao.DESC;
  contratoCatalogoParticipanteItemFiltro: ContratoCatalogoParticipanteItemFiltro = new ContratoCatalogoParticipanteItemFiltro();

  // #region Edição de Participante Item
  modalRef: any;

  private form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private errorService: ErrorService,
    private authService: AutenticacaoService,
  ) {
    super();
  }

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.tipoAlcadaAprovacao = this.usuarioAtual.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao;
    this.construirTabelas();
    this.obterItens();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'Produto',
          'contratoCatalogoItem.produto.descricao',
          CustomTableColumnType.text,
        ),
        new CustomTableColumn('Qtd. total', 'quantidadeTotal', CustomTableColumnType.text),
        new CustomTableColumn(
          'Qtd. solicitada',
          'quantidadeSolicitada',
          CustomTableColumnType.text,
        ),
        new CustomTableColumn(
          'Qtd. disponível',
          'quantidadeDisponivel',
          CustomTableColumnType.text,
        ),
        this.tipoAlcadaAprovacao === this.tipoAlcadaAprovacaoEnum.unificada ?
          new CustomTableColumn('Alçada de Aprovação', 'alcada.descricao', CustomTableColumnType.text) :
          new CustomTableColumn('Centro de Custo', 'centroCusto.descricao', CustomTableColumnType.text),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          SituacaoContratoCatalogoItem,
        ),
      ],
      'check',
    );
  }

  selecao(itens: Array<ContratoCatalogoParticipanteItem>) {
    this.selecionados = itens;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterItens('');
  }

  // #region Alterar situacao
  alterarSituacao(situacao: SituacaoContratoCatalogoItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService
      .alterarSituacaoParticipanteItensContratoBatch(
        this.idContrato,
        this.participante.idContratoCatalogoParticipante,
        this.selecionados,
        situacao,
      ).pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();

          this.obterItens();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
  // #endregion

  salvar() {
    this.activeModal.close();
  }

  cancelar() {
    this.activeModal.close();
  }

  abrirEdicao() {
    const modalRef = this.modalService.open(ProdutosItensParticipanteComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalRef.componentInstance.idContrato = this.idContrato;
    modalRef.componentInstance.participante = this.participante;
    modalRef.componentInstance.contratoCatalogoParticipanteItem = this.selecionados[0];

    modalRef.result.then((result) => {
      if (result) {
        this.obterItens();
      }
    });
  }

  editar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      const item = this.form.value;
      this.contratoService
        .alterarParticipanteItemContrato(
          this.idContrato,
          this.participante.idContratoCatalogoParticipante,
          item,
        ).pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.obterItens();
            this.modalRef.close();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  cancelarEdicao() {
    this.modalRef.close();
  }
  // #endregion

  AdicionarProdutos() {
    const modalRef = this.modalService.open(ProdutosItensParticipanteComponent, {
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

  private obterItens(termo: string = '') {

    this.contratoCatalogoParticipanteItemFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoParticipanteItemFiltro.idContratoCatalogoParticipante = this.participante.idContratoCatalogoParticipante;
    this.contratoCatalogoParticipanteItemFiltro.itensPorPagina = this.registrosPorPagina;
    this.contratoCatalogoParticipanteItemFiltro.pagina = this.pagina;
    this.contratoCatalogoParticipanteItemFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoParticipanteItemFiltro.itemOrdenar = this.itemOrdenar;
    this.contratoCatalogoParticipanteItemFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService
      .filtrarParticipanteItensContrato(
        this.contratoCatalogoParticipanteItemFiltro,
      ).pipe(takeUntil(this.unsubscribe)).subscribe(
        (response) => {
          if (response) {
            this.itens = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.itens = new Array<ContratoCatalogoParticipanteItem>();
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
}
