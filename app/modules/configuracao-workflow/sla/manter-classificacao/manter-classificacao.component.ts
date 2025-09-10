import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, SlaService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Classificacao } from '@shared/models';

@Component({
  selector: 'app-manter-classificacao',
  templateUrl: './manter-classificacao.component.html',
  styleUrls: ['./manter-classificacao.component.scss']
})
export class ManterClassificacaoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    public slaService: SlaService
  ) { }

  async ngOnInit() {
    this.construirFormulario();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idClassificacao: [0],
      idTenant: [0],
      descricao: ['', Validators.required]
    });
  }

  public salvar() {
    if (this.formularioValido()) {
      let classificacao = this.form.value;
      this.inserir(classificacao);
    }
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private inserir(classificacao: Classificacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    
    this.slaService.inserirClassificacao(classificacao).subscribe(      
      response => {
        if (response)
          this.activeModal.close(response);
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }, responseError => {
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        }
        else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }

}
