import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ContratoCatalogoFaturamento } from '../../../../shared/models/contrato-catalogo/contrato-catalogo-faturamento';
import { AnaliseAprovacaoCatalogo } from '../../../../shared/models/enums/analise-aprovacao-catalogo';
import { TranslationLibraryService } from '../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../shared/utils/error.service';

@Component({
  selector: 'smk-recusa-reajuste-faturamento',
  templateUrl: './recusa-reajuste-faturamento.component.html',
  styleUrls: ['./recusa-reajuste-faturamento.component.scss']
})
export class RecusaReajusteFaturamentoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idContratoCatalogoFaturamento: number;
  contratoCatalogoFaturamento: ContratoCatalogoFaturamento;

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

    let contratos = new Array<ContratoCatalogoFaturamento>() ;
    contratos.push(this.contratoCatalogoFaturamento);

    this.contratoService.analiseAprovacaoFaturamento(AnaliseAprovacaoCatalogo.reprovado, contratos).pipe(
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
      );
  }

  fechar(op: boolean) {
    this.activeModal.close(op);
  }
}
