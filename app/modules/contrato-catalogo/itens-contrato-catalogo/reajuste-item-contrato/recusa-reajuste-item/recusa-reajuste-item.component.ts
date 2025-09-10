import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ContratoCatalogoItem } from '../../../../../shared/models';
import { TranslationLibraryService } from '../../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../../shared/utils/error.service';
import { AnaliseAprovacaoCatalogo } from './../../../../../shared/models/enums/analise-aprovacao-catalogo';

@Component({
  selector: 'smk-recusa-reajuste-item',
  templateUrl: './recusa-reajuste-item.component.html',
  styleUrls: ['./recusa-reajuste-item.component.scss']
})
export class RecusaReajusteItemComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idContratoCatalogoItem: number;
  contratoCatalogoItem: ContratoCatalogoItem;

  formJustificativa: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private errorService: ErrorService
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

    this.contratoService.analiseAprovacaoItem(AnaliseAprovacaoCatalogo.reprovado, this.contratoCatalogoItem).pipe(
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
        }
      )
  }

  fechar(op: boolean) {
    this.activeModal.close(op);
  }
}
