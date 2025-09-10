import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CategoriaMaterial } from '@shared/models';
import { CategoriaMaterialService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'manter-categoria-material',
  templateUrl: './manter-categoria-material.component.html',
  styleUrls: ['./manter-categoria-material.component.scss']
})
export class ManterCategoriaMaterialComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;
    public form: FormGroup;
    public categoriaMaterial: CategoriaMaterial;

    constructor(
        private categoriaMaterialService: CategoriaMaterialService,
        private translationLibrary: TranslationLibraryService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
        this.construirFormulario();
        if (this.categoriaMaterial) {
            this.preencherFormulario();
        }
    }
    private preencherFormulario() {
        this.form.patchValue(this.categoriaMaterial);
    }

    private construirFormulario() {
        this.form = this.fb.group({
            idCategoriaMaterial:[0],
            idTenant:[0],
            descricao:[null, Validators.compose([Validators.required, Validators.maxLength(200)])],
            codigo:[null, Validators.compose([Validators.required, Validators.maxLength(10)])],
        })
    }

    public salvar(){
        this.blockUI.start(this.translationLibrary.translations.LOADING)
        if (this.form.valid) {
            let categoriaMaterial: CategoriaMaterial = this.form.value;
    
            if (categoriaMaterial.idCategoriaMaterial) {
                this.alterar(categoriaMaterial);
            } else {
                this.inserir(categoriaMaterial);
            }
        } else {
            this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
            this.blockUI.stop();
        }
    }

    private inserir(categoriaMaterial: CategoriaMaterial){
        this.blockUI.start();
        this.categoriaMaterialService
            .inserir(categoriaMaterial)
            .subscribe(
                response =>{
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.warning("Falha ao inserir nova categoria de material. Por favor, tente novamente.");
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

    private alterar(categoriaMaterial: CategoriaMaterial){
        this.blockUI.start();
        this.categoriaMaterialService
            .alterar(categoriaMaterial)
            .subscribe(
                response => {
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.warning("Falha ao alterar Categoria do material. Por favor, tente novamente.");
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
