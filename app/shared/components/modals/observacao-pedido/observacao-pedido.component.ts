import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pedido } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { PedidoService } from '../../../providers/pedido.service';
import { Unsubscriber } from '../../base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'observacao-pedido',
  templateUrl: './observacao-pedido.component.html',
  styleUrls: ['./observacao-pedido.component.scss'],
})
export class ObservacaoPedidoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() pedido: Pedido;

  formObsevacaoPedido: FormGroup;
  readonly: boolean;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private pedidoService: PedidoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit() {
    this.formObsevacaoPedido = this.fb.group({
      idPedido: [this.pedido.idPedido],
      observacao: [this.pedido.observacao, Validators.required],
    });
  }

  salvar() {
    this.pedidoService.observacaoPedido(this.formObsevacaoPedido.value).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (res) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.fechar(true);
        },
        (error) => {
          if (error.error) {
            error.error.forEach((e) => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
          this.fechar(false);
        },
      );
  }
  fechar(op: boolean) {
    this.activeModal.close(op);
  }
}
