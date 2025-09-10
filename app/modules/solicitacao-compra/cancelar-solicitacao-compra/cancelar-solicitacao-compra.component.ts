import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ItemSolicitacaoCompra } from '@shared/models';

@Component({
  selector: 'app-cancelar-solicitacao-compra',
  templateUrl: './cancelar-solicitacao-compra.component.html',
  styleUrls: ['./cancelar-solicitacao-compra.component.scss']
})
export class CancelarSolicitacaoCompraComponent implements OnInit {
  @Input() titulo: string = 'Title';
  @Input() cancelarLabel: string = 'Cancelar';
  @Input() confirmarLabel: string = 'Confirmar';
  @Input() justificativa: string = '';

  public form: FormGroup;

  public itensSolicitacaoCompra: Array<ItemSolicitacaoCompra> = new Array<ItemSolicitacaoCompra>();

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.construirFormulario();
  }

  public confirmar() {
    if (this.form.valid) {
      this.activeModal.close(this.form.value);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public cancelar() {
    this.activeModal.close(false);
  }

  private construirFormulario() {
    this.form = this.fb.group({
      justificativa: ['', Validators.required]
    });
  }
}
