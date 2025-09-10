import { OnInit, Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GrupoCompradores } from '@shared/models/grupo-compradores';
import { GrupoCompradoresService } from '@shared/providers/grupo-compradores.service';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'manter-grupo-compradores',
    templateUrl: './manter-grupo-compradores.component.html',
    styleUrls: ['./manter-grupo-compradores.component.scss']
})
export class ManterGrupoCompradoresComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;

    public form: FormGroup;

    public grupoCompradores: GrupoCompradores;

    constructor(
        private grupoCompradoresService: GrupoCompradoresService,
        private translationLibrary: TranslationLibraryService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit() {
        this.construirFormulario();
        if (this.grupoCompradores) {
            this.preencherFormulario();
        }
    }

    private construirFormulario() {
        this.form = this.fb.group({
            idGrupoCompradores:[0],
            idTenant:[0],
            nomeGrupoCompradores: [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
            codigoGrupoCompradores: [null, Validators.compose([Validators.required, Validators.maxLength(10)])],
            codigoDefault: [false]
        })
    }

    private preencherFormulario(){
        this.form.patchValue(this.grupoCompradores);
    }

    public cancelar(){
        this.activeModal.close();
    }

    public salvar(){
        this.blockUI.start(this.translationLibrary.translations.LOADING)
        if (this.form.valid) {
            let grupoCompradores: GrupoCompradores = this.form.value;
    
            if (grupoCompradores.idGrupoCompradores) {
            this.alterar(grupoCompradores);
            } else {
            this.inserir(grupoCompradores);
            }
        } else {
            this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
            this.blockUI.stop();
        }
    }

    private inserir(grupoCompradores: GrupoCompradores){
        this.blockUI.start();
        this.grupoCompradoresService
            .inserir(grupoCompradores)
            .subscribe(
                response =>{
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.success("Falha ao inserir novo grupo de compradores. Por favor, tente novamente.");
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

    private alterar(grupoCompradores: GrupoCompradores){
        this.blockUI.start();
        this.grupoCompradoresService
            .alterar(grupoCompradores)
            .subscribe(
                response => {
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.success("Falha ao alterar grupo de compradores. Por favor, tente novamente.");
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

    public onDefaultChange(event: any) {
        if (!event.target.checked) {
            this.form.patchValue({ codigoDefault: false });
        }
        else if (event.target.checked) {
            this.form.patchValue({ codigoDefault: true });
        }
    }

}