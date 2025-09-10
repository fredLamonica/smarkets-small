import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UniversalValidators } from 'ng2-validators';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { PessoaJuridicaService, TranslationLibraryService } from '../../providers';
import { ExistentCompanyDto } from '@shared/models/dto/existent-company-dto';

@Component({
  selector: 'sdk-incluir-documento-modal',
  templateUrl: './sdk-incluir-documento-modal.component.html',
  styleUrls: ['./sdk-incluir-documento-modal.component.scss']
})
export class SdkIncluirDocumentoModalComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public maskCnpj = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/
  ];

  public maskCpf = [
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    '.',
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    '.',
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    '-',
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/
  ];

  public isBuyer = false;
  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.contruirFormulario();
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      documento: [
        '',
        Validators.compose([
          Validators.required,
          UniversalValidators.noEmptyString,
          CustomValidators.cpfCnpj
        ])
      ]
    });
  }

  public searchCompany() {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return;
    }

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let document = this.corrigirMascara(this.form.controls.documento.value);

    this.pessoaJuridicaService.existePessoaJuridica(document, this.isBuyer).subscribe(
      response => {
        this.blockUI.stop();
        this.handleResponse(document, response);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private handleResponse(document: string, response: ExistentCompanyDto) {
    if (this.isBuyer) {
      this.activeModal.close(
        new ExistentCompanyDto(response.isExistent, response.isBuyer, response.isSupplier, document)
      );
    } else {
      this.activeModal.close({ document: document, existentDocument: response });
    }
  }

  private corrigirMascara(document: string): string {
    let finalDocument = document.replace(/[^0-9]/g, '');
    if (finalDocument.length > 11) {
      const parte1 = finalDocument.slice(0, 2);
      const parte2 = finalDocument.slice(2, 5);
      const parte3 = finalDocument.slice(5, 8);
      const parte4 = finalDocument.slice(8, 12);
      const parte5 = finalDocument.slice(12, 15);
      finalDocument = `${parte1}.${parte2}.${parte3}/${parte4}-${parte5}`;
    } else {
      const parte1 = finalDocument.slice(0, 3);
      const parte2 = finalDocument.slice(3, 6);
      const parte3 = finalDocument.slice(6, 9);
      const parte4 = finalDocument.slice(9, 11);
      finalDocument = `${parte1}.${parte2}.${parte3}-${parte4}`;
    }

    return finalDocument;
  }
}
