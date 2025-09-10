import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Iva } from '@shared/models/iva';

import { TranslationLibraryService, IvaService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'manter-iva',
  templateUrl: './manter-iva.component.html',
  styleUrls: ['./manter-iva.component.scss']
})
export class ManterIvaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public iva: Iva;

  constructor(
    private ivaService: IvaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.construirFormulario();

    if (this.iva) {
      this.preencherFormulario();
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idIva: [0],
      idTenant: [0],
      descricaoIva: [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
      codigoIva: [null, Validators.compose([Validators.required, Validators.maxLength(10)])]
    })
  }

  private preencherFormulario() {
    this.form.patchValue(this.iva);
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    let iva: Iva = this.form.value;
    if (this.form.valid) {
      if (iva.idIva) {
        this.alterar(iva);
      }
      else {
        this.inserir(iva);
      }
    }
    else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(iva: Iva) {
    this.blockUI.start();
    this.ivaService.inserir(iva).subscribe(response => {
      if (response) {
        this.activeModal.close(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
      else {
        this.toastr.success("Falha ao inserir novo IVA. Por favor, tente novamente.");
      }
      this.blockUI.stop();
    },
      responseError => {
        this.blockUI.stop();

        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        }
        else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      });
  }

  private alterar(iva: Iva) {
    this.blockUI.start();
    this.ivaService.alterar(iva).subscribe(response => {
      if (response) {
        this.activeModal.close(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
      else {
        this.toastr.success("Falha ao alterar IVA. Por favor, tente novamente.");
      }
      this.blockUI.stop();
    }, responseError => {
      this.blockUI.stop();
      if (responseError.status == 400) {
        this.toastr.warning(responseError.error);
      }
      else {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    });
  }
}
