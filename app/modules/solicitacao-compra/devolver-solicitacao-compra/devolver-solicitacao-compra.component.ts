import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService } from '@shared/providers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemSolicitacaoCompra } from '@shared/models';

@Component({
  selector: 'app-devolver-solicitacao-compra',
  templateUrl: './devolver-solicitacao-compra.component.html',
  styleUrls: ['./devolver-solicitacao-compra.component.scss']
})
export class DevolverSolicitacaoCompraComponent implements OnInit {
  @Input() titulo: string = 'Title';
  @Input() cancelarLabel: string = 'Cancelar';
  @Input() confirmarLabel: string = 'Confirmar';
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
      justificativa: ['', Validators.required],
      enviarEmail: [false, null]
    });
  }
}
