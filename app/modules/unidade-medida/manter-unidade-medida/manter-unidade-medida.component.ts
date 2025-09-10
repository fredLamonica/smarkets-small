import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { UnidadeMedidaService, TranslationLibraryService } from '@shared/providers';
import { UnidadeMedida } from '@shared/models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manter-unidade-medida',
  templateUrl: './manter-unidade-medida.component.html',
  styleUrls: ['./manter-unidade-medida.component.scss']
})
export class ManterUnidadeMedidaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public idUnidade: number;
  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private unidadeService: UnidadeMedidaService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.contruirFormulario();
    this.obterParametros();
  }

  private obterParametros() {
    if(this.idUnidade) 
      this.obterUnidadeMedida();
  }

  private obterUnidadeMedida() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.unidadeService.obterPorId(this.idUnidade).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idUnidadeMedida: [0],
      idTenant: [0],
      codigo: [''],
      descricao: ['', Validators.required],
      sigla: ['', Validators.required],
      permiteQuantidadeFracionada: [false, Validators.required]
    });
  }

  private preencherFormulario(unidade: UnidadeMedida) {
    this.form.patchValue(unidade);
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if(this.form.valid) {
      let unidadeMedida = this.form.value;
      if(this.idUnidade)
        this.alterar(unidadeMedida);
      else
        this.inserir(unidadeMedida);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(unidadeMedida: UnidadeMedida) {
    this.unidadeService.inserir(unidadeMedida).subscribe(
      response => {
        if(response) {
          this.voltar();
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  private alterar(unidadeMedida: UnidadeMedida) {
    this.unidadeService.alterar(unidadeMedida).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  public voltar() {
    this.activeModal.close();
  }
}
