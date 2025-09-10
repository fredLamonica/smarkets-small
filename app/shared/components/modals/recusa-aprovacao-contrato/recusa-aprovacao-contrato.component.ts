import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ContratoCatalogo } from '../../../models';
import { TranslationLibraryService } from '../../../providers';
import { ContratoCatalogoService } from '../../../providers/contrato-catalogo.service';
import { Unsubscriber } from '../../base/unsubscriber';

@Component({
  selector: 'smk-recusa-aprovacao-contrato',
  templateUrl: './recusa-aprovacao-contrato.component.html',
  styleUrls: ['./recusa-aprovacao-contrato.component.scss'],
})
export class RecusaAprovacaoContratoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input() contrato: ContratoCatalogo;

  formRecusaContrato: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit() {
    this.formRecusaContrato = this.fb.group({
      idContrato: [this.contrato.idContratoCatalogo],
      motivoRecusa: [this.contrato.motivoRecusa, Validators.required],
    });
  }

  salvar() {
    this.contratoService.insereMotivoRecusaContrato(this.formRecusaContrato.controls.motivoRecusa.value, this.contrato.idContratoCatalogo).pipe(
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
