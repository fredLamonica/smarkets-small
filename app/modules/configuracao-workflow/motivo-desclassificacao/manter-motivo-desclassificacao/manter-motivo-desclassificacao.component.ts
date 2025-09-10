import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MotivoDesclassificacaoService } from '@shared/providers/motivo-desclassificacao.service';
import { MotivoDesclassificacao } from '@shared/models/cotacao/motivo-desclassificacao';

@Component({
  selector: 'manter-motivo-desclassificacao',
  templateUrl: './manter-motivo-desclassificacao.component.html',
  styleUrls: ['./manter-motivo-desclassificacao.component.scss']
})
export class ManterMotivoDesclassificacaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public motivoDesclassificacao: MotivoDesclassificacao;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AutenticacaoService,
    private motivoDesclassificacaoService: MotivoDesclassificacaoService
  ) {}

  ngOnInit() {
    this.construirFormulario();
    if (this.motivoDesclassificacao) {
      this.preencherFormulario();
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idMotivoDesclassificacao: [0],
      idTenant: [0],
      descricao: [null, Validators.required],
      codigo: [null]
    });
  }

  private preencherFormulario() {
    this.form.patchValue(this.motivoDesclassificacao);
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.form.valid) {
      let motivoDesclassificacao: MotivoDesclassificacao = this.form.value;
      if (motivoDesclassificacao.idMotivoDesclassificacao) {
        this.alterar(motivoDesclassificacao);
      } else {
        this.inserir(motivoDesclassificacao);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private inserir(motivoDesclassificacao: MotivoDesclassificacao) {
    this.blockUI.start();
    this.motivoDesclassificacaoService.inserir(motivoDesclassificacao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao inserir novo motivo de desclassificação. Por favor, tente novamente.'
          );
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private alterar(motivoDesclassificacao: MotivoDesclassificacao) {
    this.blockUI.start();
    this.motivoDesclassificacaoService.alterar(motivoDesclassificacao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao alterar motivo de desclassificação. Por favor, tente novamente.'
          );
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }
}
