import { TipoRequisicaoService } from './../../../../shared/providers/tipo-requisicao.service';
import { OnInit, Component } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TipoPedido } from '@shared/models/tipo-pedido';
import { TipoPedidoService } from '@shared/providers/tipo-pedido.service';
import { TranslationLibraryService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoRequisicao } from '@shared/models';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Component({
    selector: 'manter-tipo-pedido',
    templateUrl: './manter-tipo-pedido.component.html',
    styleUrls: ['./manter-tipo-pedido.component.scss']
})
export class ManterTipoPedidoComponent implements OnInit {

    @BlockUI() blockUI: NgBlockUI;

    public form: FormGroup;

    public tipoPedido: TipoPedido;

    public integrarApiPedidos: boolean = false;

    constructor(
        private tipoPedidoService: TipoPedidoService,
        private translationLibrary: TranslationLibraryService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        public activeModal: NgbActiveModal,
        private authService: AutenticacaoService,
        private tipoRequisicaoService: TipoRequisicaoService
    ) {}

    ngOnInit() {
        this.obterParametroIntegrarApiPedidos();
        this.construirFormulario();
        if (this.tipoPedido) {
            this.preencherFormulario();
        }
    }

    // #region Tipos de Requisicao
    public tiposRequisicao$: Observable<Array<TipoRequisicao>>;
    public loadingTipoRequisicao: boolean;

    public openTiposRequisicao() {
        if(this.tiposRequisicao$ == null){
          this.subTiposRequisicao();
        }
    }
    
    private subTiposRequisicao() {
        this.loadingTipoRequisicao = true;
        this.tiposRequisicao$ = this.tipoRequisicaoService.obterTodos().pipe(
          catchError(() => of([])),
          tap(() => this.loadingTipoRequisicao = false)
        )
    }

    public compareTipoRequisicaoFn(a, b): boolean {
        return a.idTipoRequisicao == b.idTipoRequisicao;
    }
    // #endregion

    private async obterParametroIntegrarApiPedidos(){
        this.integrarApiPedidos = await this.authService.usuario().permissaoAtual.pessoaJuridica.integrarApiPedidos;
    }

    private construirFormulario() {
        this.form = this.fb.group({
            idTipoPedido:[0],
            idTenant:[0],
            nomeTipoPedido: [null, Validators.required],
            siglaTipoPedido: [null, Validators.required],
            tiposRequisicao: [new Array<TipoRequisicao>()]
        })
        if (this.integrarApiPedidos) {
            this.form.addControl('codigoTipoPedido', new FormControl(null, Validators.required))
        } else {
            this.form.addControl('codigoTipoPedido', new FormControl(null))
        }
    }

    private preencherFormulario(){
        this.form.patchValue(this.tipoPedido);
    }

    public cancelar(){
        this.activeModal.close();
    }

    public salvar(){
        this.blockUI.start(this.translationLibrary.translations.LOADING)
        if (this.form.valid) {
            let tipoPedido: TipoPedido = this.form.value;
            if (tipoPedido.idTipoPedido) {
                this.alterar(tipoPedido);
            } else {
                this.inserir(tipoPedido);
            }
        } else {
            this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
            this.blockUI.stop();
        }
    }

    private inserir(tipoPedido: TipoPedido){
        this.blockUI.start();
        this.tipoPedidoService.inserir(tipoPedido).subscribe(response => {
            if (response) {
                this.activeModal.close(response);
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            } else {
                this.toastr.success("Falha ao inserir novo tipo de pedido. Por favor, tente novamente.");
            }
            this.blockUI.stop();
        }, responseError => {
            this.blockUI.stop();
            if (responseError.status == 400) {
                this.toastr.warning(responseError.error);
            } else {
                this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            }
        });
    }

    private alterar(tipoPedido: TipoPedido){
        this.blockUI.start();
        this.tipoPedidoService
            .alterar(tipoPedido)
            .subscribe(
                response => {
                    if (response) {
                        this.activeModal.close(response);
                        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                    } else {
                        this.toastr.success("Falha ao alterar tipo de requisição. Por favor, tente novamente.");
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