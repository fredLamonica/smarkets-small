import { ToastrService } from 'ngx-toastr';
import { Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';

@Component({
  selector: 'modal-motivo-cancelamento',
  templateUrl: './modal-motivo-cancelamento.component.html',
  styleUrls: ['./modal-motivo-cancelamento.component.scss']
})
export class ModalMotivoCancelamentoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() nomeDoc: string = 'Solicitação Cadastro Fornecedor';
  @Input() idSolicitacao: number; 

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private solicitacaoCadastroFornecedorService : SolicitacaoCadastroFornecedorService,
  ) {}

  ngOnInit() {
    this.construirFormulario();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      motivoRecusa: [null, Validators.required]
    });
  }

  public confirmar() {
    if (this.form.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCadastroFornecedorService
      .cancel(this.idSolicitacao, this.form.value.motivoRecusa)
      .subscribe(
        response => {          
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS); 
          this.activeModal.close(this.form.value.motivoRecusa);        
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
    else this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);

    // this.solicitarAlteracao.emit(true);
  }
}
