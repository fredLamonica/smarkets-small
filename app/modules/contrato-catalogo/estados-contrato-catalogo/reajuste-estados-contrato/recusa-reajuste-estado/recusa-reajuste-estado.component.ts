import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Unsubscriber } from '../../../../../shared/components/base/unsubscriber';
import { ContratoCatalogoEstado } from '../../../../../shared/models';
import { TranslationLibraryService } from '../../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../../shared/utils/error.service';

@Component({
  selector: 'smk-recusa-reajuste-estado',
  templateUrl: './recusa-reajuste-estado.component.html',
  styleUrls: ['./recusa-reajuste-estado.component.scss'],
})
export class RecusaReajusteEstadoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  idContratoCatalogoEstado: number;
  contratoCatalogoEstado: ContratoCatalogoEstado;

  formJustificativa: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.formJustificativa = this.fb.group({
      justificativa: [null],
    });
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    /*this.contratoService.analiseAprovacaoEstado(AnaliseAprovacaoCatalogo.reprovado, this.contratoCatalogoEstado).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((result) => {
        if (result) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.activeModal.close(true);
        }
      },
        (error) => {
          if (error) {
            this.errorService.treatError(error);
            this.blockUI.stop();
          }
        },
      );*/
  }

  fechar(op: boolean) {
    this.activeModal.close(op);
  }
}
