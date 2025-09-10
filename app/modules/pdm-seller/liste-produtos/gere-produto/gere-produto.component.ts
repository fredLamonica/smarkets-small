import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { Produto } from '../../../../shared/models';
import { TranslationLibraryService } from '../../../../shared/providers';

@Component({
  selector: 'smk-gere-produto',
  templateUrl: './gere-produto.component.html',
  styleUrls: ['./gere-produto.component.scss']
})
export class GereProdutoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idProduto: number;
  form: FormGroup;
  produto: Produto;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private produtoService: ProdutoService
  ) {
    super();
  }

  async ngOnInit() {
    this.contruirFormulario();
    this.obterPorId();
  }

  ngAfterViewInit() { }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.atualizeProdutoSeller(this.produto, true).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if(response){
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCESS)
        }
        this.blockUI.stop();
        this.activeModal.close(true);
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }

  voltarGoogle(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.atualizeProdutoSeller(this.produto, false).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if(response){
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCESS)
        }
        this.blockUI.stop();
        this.activeModal.close(true);
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
    );
  }

  cancelar() {
    this.activeModal.close();
  }

  private obterPorId() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.obtenhaProdutoSellerPorId(this.idProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.produto = response;
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  preencherFormulario(produto: Produto){
    this.form.patchValue({
      idProduto: produto.idProduto,
      descricao: produto.descricao,
      especificacao: produto.especificacao,
    })
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idProduto: [null],
      descricao: [null],
      especificacao: [null],
    });
  }


}
