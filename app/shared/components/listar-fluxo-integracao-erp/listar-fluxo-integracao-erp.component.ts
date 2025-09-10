import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBlockUI } from 'ng-block-ui';
import { BlockUIInstanceService } from 'ng-block-ui/lib/services/block-ui-instance.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { OrigemFluxoIntegracaoErp } from '../../models/enums/origem-fluxo-integracao-erp.enum';
import { FluxoIntegracaoErp } from '../../models/fluxo-integracao-erp';
import { FluxoIntegracaoErpService } from '../../models/interfaces/fluxo-integracao-erp-service';
import { TranslationLibraryService } from '../../providers';
import { PedidoFluxoIntegracaoErpService } from '../../providers/pedido-fluxo-integracao-erp.service';
import { RequisicaoFluxoIntegracaoErpService } from '../../providers/requisicao-fluxo-integracao-erp.service';
import { ErrorService } from '../../utils/error.service';
import { Unsubscriber } from '../base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-listar-fluxo-integracao-erp',
  templateUrl: './listar-fluxo-integracao-erp.component.html',
  styleUrls: ['./listar-fluxo-integracao-erp.component.scss'],
})
export class ListarFluxoIntegracaoErpComponent extends Unsubscriber implements OnInit {

  @Input() id: number;
  @Input() origem: OrigemFluxoIntegracaoErp;
  @Input() modoModal: boolean;

  blockUIComponentBody: NgBlockUI;
  blockUIComponentBodyName: string;
  recargaHabilitada: boolean = true;
  fluxos: Array<FluxoIntegracaoErp>;
  motivoErro: string;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;

  constructor(
    private toastr: ToastrService,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private activeModal: NgbActiveModal,
    private blockUIInstanceService: BlockUIInstanceService,
    private errorService: ErrorService,
    private pedidoFluxoIntegracaoErpService: PedidoFluxoIntegracaoErpService,
    private requisicaoFluxoIntegracaoErpService: RequisicaoFluxoIntegracaoErpService,
  ) {
    super();
  }

  ngOnInit() {
    this.configureBlockUiComponentBody();
    this.populeFluxos();
  }

  paginacao(event: any) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.populeFluxos();
  }

  recarregueFluxos(): void {
    this.desabiliteRecarga();
    this.pagina = 1;
    this.populeFluxos();
  }

  visualizar(modalMotivoErro: TemplateRef<any>, motivoErro: string): void {
    this.motivoErro = motivoErro;
    this.modalService.open(modalMotivoErro, { centered: true, backdrop: 'static' });
  }

  reenviarParaIntegracao(fluxo: FluxoIntegracaoErp): void {
    this.blockUIComponentBody.start(this.translationLibrary.translations.LOADING);

    this.service().resend(this.id, fluxo.idFluxoIntegracaoErp).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUIComponentBody.stop()))
      .subscribe(
        () => {
          this.recarregueFluxos();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        (error) => this.errorService.treatError(error),
      );
  }

  fecheModal() {
    this.activeModal.close();
  }

  private populeFluxos(): void {
    this.blockUIComponentBody.start(this.translationLibrary.translations.LOADING);

    this.service().get(this.id, this.itensPorPagina, this.pagina).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUIComponentBody.stop()))
      .subscribe(
        (paginacao) => {
          if (paginacao) {
            this.totalPaginas = paginacao.numeroPaginas;
            this.fluxos = paginacao.itens;
          } else {
            this.totalPaginas = 1;
            this.fluxos = new Array<FluxoIntegracaoErp>();
          }
        },
        (error) => this.errorService.treatError(error),
      );
  }

  private desabiliteRecarga(): void {
    this.recargaHabilitada = false;

    setTimeout(() => {
      this.recargaHabilitada = true;
    }, 2000);
  }

  private configureBlockUiComponentBody() {
    this.blockUIComponentBodyName = `component-body`;
    this.blockUIComponentBody = this.blockUIInstanceService.decorate(this.blockUIComponentBodyName);
  }

  private service(): FluxoIntegracaoErpService {
    switch (this.origem) {
      case OrigemFluxoIntegracaoErp.pedido:
        return this.pedidoFluxoIntegracaoErpService;

      case OrigemFluxoIntegracaoErp.requisicao:
        return this.requisicaoFluxoIntegracaoErpService;
    }
  }

}
