import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, TipoRequisicaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoRequisicao } from '@shared/models';

@Component({
  selector: 'manter-tipo-requisicao',
  templateUrl: './manter-tipo-requisicao.component.html',
  styleUrls: ['./manter-tipo-requisicao.component.scss']
})
export class ManterTipoRequisicaoComponent implements OnInit {
  
  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public tipoRequisicao: TipoRequisicao;

  constructor(
    private tipoRequisicaoService: TipoRequisicaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.construirFormulario();

    if (this.tipoRequisicao){
      this.preencherFormulario();
    }
  }

  private construirFormulario(){
    this.form = this.fb.group({
        idTipoRequisicao: [0],
        idTenant: [0],
        nome: [null, Validators.required],
        sigla: [null, Validators.required],
        tipoDocumento: [null, Validators.required]
      }
    )
  }

  private preencherFormulario(){
    this.form.patchValue(this.tipoRequisicao);
  }

  public cancelar(){
    this.activeModal.close();
  }

  public salvar(){
    let tipoRequisicao: TipoRequisicao = this.form.value;

    if (tipoRequisicao.idTipoRequisicao){
      this.alterar(tipoRequisicao);
    }
    else{
      this.inserir(tipoRequisicao);
    }
  }

  private inserir(tipoRequisicao: TipoRequisicao){
    this.blockUI.start();
    this.tipoRequisicaoService.inserir(tipoRequisicao).subscribe(response =>{
      if (response){
        this.activeModal.close(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
      else{
        this.toastr.success("Falha ao inserir novo tipo de requisição. Por favor, tente novamente.");
      }
      this.blockUI.stop();
    }, responseError =>{
      this.blockUI.stop();

      if (responseError.status == 400){
        this.toastr.warning(responseError.error);
      }
      else{
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    });
  }

  private alterar(tipoRequisicao: TipoRequisicao){
    this.blockUI.start();
    this.tipoRequisicaoService.alterar(tipoRequisicao).subscribe(response =>{
      if (response){
        this.activeModal.close(response);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      }
      else{
        this.toastr.success("Falha ao alterar tipo de requisição. Por favor, tente novamente.");
      }
      this.blockUI.stop();
    }, responseError =>{
      this.blockUI.stop();

      if (responseError.status == 400){
        this.toastr.warning(responseError.error);
      }
      else{
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    });
  }
}
