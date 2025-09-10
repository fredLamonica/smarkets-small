import { ImpactoQuestao } from './../../../../../../shared/models/enums/impacto-questao';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TranslationLibraryService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoVisitaTecnicaService } from '@shared/providers/configuracao-visita-tecnica.service';
import { ConfiguracaoVisitaTecnica } from '@shared/models/configuracao-visita-tecnica';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-manter-configuracao-visita-tecnica',
  templateUrl: './manter-configuracao-visita-tecnica.component.html',
  styleUrls: ['./manter-configuracao-visita-tecnica.component.scss']
})
export class ManterConfiguracaoVisitaTecnicaComponent implements OnInit {

    public form: FormGroup = this.contruirFormulario();
    @BlockUI() blockUI: NgBlockUI;
    public configuracoesVisitasTecnicasIncluidas: Array<ConfiguracaoVisitaTecnica>;
    public ImpactoQuestao = ImpactoQuestao;

  constructor(
    private configuracaoVisitaTecnicaService: ConfiguracaoVisitaTecnicaService,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { }

  private contruirFormulario() {
    return this.fb.group({
      idConfiguracaoVisitaTecnica: [0],
      questao: [''],
      tipo: [1],
      impacto: null,
      idTenant: [0],
    });
  }

  public cancelar(){
    this.activeModal.close();
  }

  public salvar(){
    if (this.form.controls.idConfiguracaoVisitaTecnica.value) {
      this.alterar();
    } else {
      this.adicionar();
    }
  }
  
  public adicionar() {
    if(this.isNullOrWhitespace(this.form.controls.questao.value)  || this.isNullOrWhitespace(this.form.controls.impacto.value)){
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }else{
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.configuracaoVisitaTecnicaService.inserir(this.form.value).subscribe(
        response => {
          this.activeModal.close(response);
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  public alterar(){
    if(this.isNullOrWhitespace(this.form.controls.questao.value) || this.isNullOrWhitespace(this.form.controls.impacto.value)){
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }else{
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.configuracaoVisitaTecnicaService.alterar(this.form.value).subscribe(
        response => {
          this.activeModal.close(this.form.value);
          this.blockUI.stop();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  public isNullOrWhitespace( input ) {
    var a = !input;
    try{
      var b = !input.trim();
    }catch{}
    return a || b;
  }

}
