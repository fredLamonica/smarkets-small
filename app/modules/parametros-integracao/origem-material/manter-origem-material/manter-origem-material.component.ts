import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OrigemMaterial } from '@shared/models';
import { OrigemMaterialService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'manter-origem-material',
    templateUrl: './manter-origem-material.component.html',
    styleUrls: ['./manter-origem-material.component.scss']
})
export class ManterOrigemMaterialComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    public form: FormGroup;
    public origemMaterial: OrigemMaterial;

    constructor(
        private origemMaterialService: OrigemMaterialService,
        private translationLibrary: TranslationLibraryService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.construirFormulario();
        if (this.origemMaterial) {
            this.preencherFormulario();
        }
    }
    private preencherFormulario() {
        this.form.patchValue(this.origemMaterial);
    }

    private construirFormulario() {
        this.form = this.fb.group({
            idOrigemMaterial:[0],
            idTenant:[0],
            descricao:[null, Validators.compose([Validators.required, Validators.maxLength(200)])],
            codigo:[null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        })
    }

    public salvar(){
        this.blockUI.start(this.translationLibrary.translations.LOADING)
        if (this.form.valid) {
            let origemMaterial: OrigemMaterial = this.form.value;
    
            if (origemMaterial.idOrigemMaterial) {
                this.alterar(origemMaterial);
            } else {
                this.inserir(origemMaterial);
            }
        } else {
            this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
            this.blockUI.stop();
        }
    }

    private inserir(origemMaterial: OrigemMaterial){
        this.blockUI.start();
        this.origemMaterialService
            .inserir(origemMaterial)
            .subscribe(
                response =>{
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.warning("Falha ao inserir nova origem de material. Por favor, tente novamente.");
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

    private alterar(origemMaterial: OrigemMaterial){
        this.blockUI.start();
        this.origemMaterialService
            .alterar(origemMaterial)
            .subscribe(
                response => {
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.warning("Falha ao alterar Origem do material. Por favor, tente novamente.");
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
