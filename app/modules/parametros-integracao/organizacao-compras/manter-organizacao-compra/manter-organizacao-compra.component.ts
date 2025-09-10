import { Component, OnInit } from '@angular/core';
import { OrganizacaoCompraService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrganizacaoCompra } from '@shared/models/organizacao-compra';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'manter-organizacao-compra',
  templateUrl: './manter-organizacao-compra.component.html',
  styleUrls: ['./manter-organizacao-compra.component.scss']
})
export class ManterOrganizacaoCompraComponent implements OnInit {


  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public organizacaoCompra: OrganizacaoCompra;

  constructor(
    private organizacaoCompraService: OrganizacaoCompraService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.construirFormulario();

    if (this.organizacaoCompra) {
      this.preencherFormulario();
    }
  }


  private construirFormulario() {
    this.form = this.fb.group({
      idOrganizacaoCompra: [0],
      idTenant: [0],
      descricaoOrganizacaoCompra: [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
      codigoOrganizacaoCompra: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
      codigoDefault: [false]
    })
  }

  private preencherFormulario() {
    this.form.patchValue(this.organizacaoCompra);
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    let organizacaoCompra: OrganizacaoCompra = this.form.value;
    if (this.form.valid) {
      if (organizacaoCompra.idOrganizacaoCompra) {
        this.alterar(organizacaoCompra);
      }
      else {
        this.inserir(organizacaoCompra);
      }
    }
    else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(organizacaoCompra: OrganizacaoCompra) {
    this.blockUI.start();
    this.organizacaoCompraService.inserir(organizacaoCompra).subscribe(response => {
      if (response) {
        this.activeModal.close(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
      else {
        this.toastr.success("Falha ao inserir nova organização de compra. Por favor, tente novamente.");
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

  private alterar(organizacaoCompra: OrganizacaoCompra) {
    this.blockUI.start();
    this.organizacaoCompraService.alterar(organizacaoCompra).subscribe(response => {
      if (response) {
        this.activeModal.close(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
      else {
        this.toastr.success("Falha ao alterar configuração de compra. Por favor, tente novamente.");
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

  public onDefaultChange(event: any) {
    if (!event.target.checked) {
      this.form.patchValue({ codigoDefault: false });
    }
    else if (event.target.checked) {
      this.form.patchValue({ codigoDefault: true });
    }
  }
}
