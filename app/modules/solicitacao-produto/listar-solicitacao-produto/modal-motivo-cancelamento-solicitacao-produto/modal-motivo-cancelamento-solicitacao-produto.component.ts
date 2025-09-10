import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SolicitacaoProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modal-motivo-cancelamento-solicitacao-produto',
  templateUrl: './modal-motivo-cancelamento-solicitacao-produto.component.html',
  styleUrls: ['./modal-motivo-cancelamento-solicitacao-produto.component.scss']
})
export class ModalMotivoCancelamentoSolicitacaoProdutoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @Input() idSolicitacaoProduto: number;

  form: FormGroup;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private solicitacaoProdutoService: SolicitacaoProdutoService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      motivoCancelamento: [null, Validators.required]
    });
  }

  public confirme() {
    if (this.form.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.solicitacaoProdutoService.cancelar(this.idSolicitacaoProduto, this.form.value.motivoCancelamento).subscribe(
        () => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.activeModal.close(true);
          this.blockUI.stop();
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        }
      );
    }
    else {
      this.form.controls.motivoCancelamento.markAsDirty();
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

}
