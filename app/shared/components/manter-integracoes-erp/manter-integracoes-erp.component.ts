import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ManterErpComponent } from '@shared/components/modals/manter-erp/manter-erp.component';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Paginacao } from '@shared/models';
import { TipoIntegracaoErp } from '@shared/models/enums/tipo-integracao-erp';
import { IntegracaoErp } from '@shared/models/integracao-com-erp/integracao-erp';
import { IntegracaoErpExclusao } from '@shared/models/integracao-com-erp/integracao-erp-exclusao';
import { TranslationLibraryService } from '@shared/providers';
import { IntegracaoErpService } from '@shared/providers/integracao-erp.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-manter-integracoes-erp',
  templateUrl: './manter-integracoes-erp.component.html',
  styleUrls: ['./manter-integracoes-erp.component.scss'],
})
export class ManterIntegracoesErpComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // O 'ID do vínculo' pode ser o de um produto, o de uma condição de pagamento ou o de um fornecedor.
  // Quando é o de um 'produto' ou o de uma 'condição de pagamento' o mesmo é populado através de um input property binding.
  // Quando é o de um 'fornecedor' o mesmo é populado através do metadado 'tipoIntegracaoErp'
  // configurado na rota dentro do módulo de rotas e o valor é atribuído no hook ngOnInit deste component.
  @Input() idVinculo: number;
  @Input() tipoIntegracaoErp: TipoIntegracaoErp;

  integracoesErp: Array<IntegracaoErp>;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  listaDeIntegracoesErp: Array<IntegracaoErp>;
  tableSettings: CustomTableSettings;
  integracoesErpInclusao: Array<IntegracaoErp>;
  integracoesErpSelecionadas: Array<IntegracaoErp>;
  tipoIntegracaoProduto: TipoIntegracaoErp = TipoIntegracaoErp.produto;
  tipoIntegracaoFornecedor: TipoIntegracaoErp = TipoIntegracaoErp.fornecedor;
  tipoIntegracaoCondicaoPagamento: TipoIntegracaoErp = TipoIntegracaoErp.condicaoPagamento;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private integracaoErpService: IntegracaoErpService,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit() {
    const tipoIntegracaoErp = this.activatedRoute.snapshot.data['tipoIntegracaoErp'] as TipoIntegracaoErp;

    if (tipoIntegracaoErp) {
      this.tipoIntegracaoErp = tipoIntegracaoErp;
      this.idVinculo = this.activatedRoute.snapshot.parent.params['id'];

      if (this.idVinculo) {
        this.populeIntegracoesErp();
      }
    } else {
      this.populeIntegracoesErp();
    }

    this.populeConfiguracaoDaGrid();
  }

  populeIntegracoesErp(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let endpointGetListaGestaoIntegracao: Observable<Paginacao<IntegracaoErp>>;

    switch (this.tipoIntegracaoErp) {
      case TipoIntegracaoErp.produto:
        endpointGetListaGestaoIntegracao = this.integracaoErpService.getListaGestaoIntegracaoProduto(this.idVinculo, this.itensPorPagina, this.pagina);
        break;

      case TipoIntegracaoErp.fornecedor:
        endpointGetListaGestaoIntegracao = this.integracaoErpService.getListaGestaoIntegracaoFornecedor(this.idVinculo, this.itensPorPagina, this.pagina);
        break;

      case TipoIntegracaoErp.condicaoPagamento:
        endpointGetListaGestaoIntegracao = this.integracaoErpService.getListaGestaoIntegracaoCondicaoPagamento(this.idVinculo, this.itensPorPagina, this.pagina);
        break;
    }

    endpointGetListaGestaoIntegracao.pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (paginacao) => {
          if (paginacao) {
            this.integracoesErp = paginacao.itens.map((integracaoErp) => new IntegracaoErp({ ...integracaoErp }));
            this.totalPaginas = paginacao.numeroPaginas;
          } else {
            this.integracoesErp = new Array<IntegracaoErp>();
          }

          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        });
  }

  populeIntegracoesErpSelecionadas(integracoesErpSelecionadas: Array<IntegracaoErp>) {
    this.integracoesErpSelecionadas = integracoesErpSelecionadas;
  }

  abrirInclusaoDeIntegracoesErp() {
    const modalRef = this.modalService.open(ManterErpComponent, { size: 'lg', centered: true, backdrop: 'static' });

    modalRef.componentInstance.title = 'INCLUIR INTEGRAÇÃO ERP';
    modalRef.componentInstance.idVinculo = this.idVinculo;
    modalRef.componentInstance.tipoIntegracaoErp = this.tipoIntegracaoErp;

    modalRef.result.then((result) => {
      if (result) {
        this.populeIntegracoesErp();
      }
    });
  }

  abrirEdicaoDaIntegracaoErp() {
    const modalRef = this.modalService.open(ManterErpComponent, { size: 'lg', centered: true, backdrop: 'static' });

    modalRef.componentInstance.title = 'EDITAR INTEGRAÇÃO ERP';
    modalRef.componentInstance.id = this.integracoesErpSelecionadas[0].id;
    modalRef.componentInstance.idVinculo = this.idVinculo;
    modalRef.componentInstance.tipoIntegracaoErp = this.tipoIntegracaoErp;

    modalRef.result.then((result) => {
      if (result) {
        this.populeIntegracoesErp();
      }
    });
  }

  abrirExclusaoDeIntegracoesErp(): void {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true, backdrop: 'static' }).result.then(
      (result) => {
        if (result) {
          const integracaoErpExclusao = new IntegracaoErpExclusao({ ids: this.integracoesErpSelecionadas.map((i) => i.id) });

          let endpointDeleteGestaoIntegracao: Observable<number>;

          switch (this.tipoIntegracaoErp) {
            case TipoIntegracaoErp.produto:
              endpointDeleteGestaoIntegracao = this.integracaoErpService.deleteGestaoIntegracaoProduto(this.idVinculo, integracaoErpExclusao);
              break;

            case TipoIntegracaoErp.fornecedor:
              endpointDeleteGestaoIntegracao = this.integracaoErpService.deleteGestaoIntegracaoFornecedor(this.idVinculo, integracaoErpExclusao);
              break;

            case TipoIntegracaoErp.condicaoPagamento:
              endpointDeleteGestaoIntegracao = this.integracaoErpService.deleteGestaoIntegracaoCondicaoPagamento(integracaoErpExclusao);
              break;
          }

          endpointDeleteGestaoIntegracao.pipe(
            takeUntil(this.unsubscribe))
            .subscribe(() => this.populeIntegracoesErp());
        }
      },
      () => { });
  }

  onChangePaginacao(event: any): void {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.populeIntegracoesErp();
  }

  private populeConfiguracaoDaGrid() {
    this.tableSettings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'id', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Código integração', 'codigoIntegracao', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Razão Social', 'razaoSocial', CustomTableColumnType.text, null, null),
        new CustomTableColumn('CNPJ', 'cnpj', CustomTableColumnType.text, null, null),
      ], 'check',
    );
  }
}
