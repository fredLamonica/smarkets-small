import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UtilizacaoMaterial } from '@shared/models';
import { UtilizacaoMaterialService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'manter-utilizacao-material',
  templateUrl: './manter-utilizacao-material.component.html',
  styleUrls: ['./manter-utilizacao-material.component.scss']
})
export class ManterUtilizacaoMaterialComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    public form: FormGroup;
    public utilizacaoMaterial: UtilizacaoMaterial;

    constructor(
        private utilizacaoMaterialService: UtilizacaoMaterialService,
        private translationLibrary: TranslationLibraryService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.construirFormulario();
        if (this.utilizacaoMaterial) {
            this.preencherFormulario();
        }
    }
    private preencherFormulario() {
        this.form.patchValue(this.utilizacaoMaterial);
    }

    private construirFormulario() {
        this.form = this.fb.group({
            idUtilizacaoMaterial:[0],
            idTenant:[0],
            descricao:[null, Validators.compose([Validators.required, Validators.maxLength(200)])],
            codigo:[null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        })
    }

    public salvar(){
        this.blockUI.start(this.translationLibrary.translations.LOADING)
        if (this.form.valid) {
            let utilizacaoMaterial: UtilizacaoMaterial = this.form.value;
    
            if (utilizacaoMaterial.idUtilizacaoMaterial) {
                this.alterar(utilizacaoMaterial);
            } else {
                this.inserir(utilizacaoMaterial);
            }
        } else {
            this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
            this.blockUI.stop();
        }
    }

    private inserir(utilizacaoMaterial: UtilizacaoMaterial){
        this.blockUI.start();
        this.utilizacaoMaterialService
            .inserir(utilizacaoMaterial)
            .subscribe(
                response =>{
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.warning("Falha ao inserir nova utilizacao de material. Por favor, tente novamente.");
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

    private alterar(utilizacaoMaterial: UtilizacaoMaterial){
        this.blockUI.start();
        this.utilizacaoMaterialService
            .alterar(utilizacaoMaterial)
            .subscribe(
                response => {
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.warning("Falha ao alterar Utilizacao do material. Por favor, tente novamente.");
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

    public cancelar(){
        this.activeModal.close();
    }
}
