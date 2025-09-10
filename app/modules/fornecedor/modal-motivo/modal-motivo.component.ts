import { ToastrService } from 'ngx-toastr';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  SituacaoValidacaoDocumentoFornecedor,
  SolicitacaoDocumentoFornecedorArquivo
} from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';

@Component({
  selector: 'modal-motivo',
  templateUrl: './modal-motivo.component.html',
  styleUrls: ['./modal-motivo.component.scss']
})
export class ModalMotivoComponent implements OnInit {
  @Input() nomeDoc: string = 'teste';
  @Input() doc: SolicitacaoDocumentoFornecedorArquivo;
  private enum = SituacaoValidacaoDocumentoFornecedor;
  @Output() solicitarAlteracao: EventEmitter<any> = new EventEmitter();

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService
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
    if (this.form.valid) this.activeModal.close(this.form.value.motivoRecusa);
    else this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);

    // this.solicitarAlteracao.emit(true);
  }
}
