import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CategoriaProduto, UnidadeMedida } from '@shared/models';
import { ProdutoEmpresaBase } from '@shared/models/produto-empresa-base';
import { CategoriaProdutoService, TranslationLibraryService, UnidadeMedidaService } from '@shared/providers';
import { UtilitiesService } from '@shared/utils/utilities.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-clonar-produtos-empresa-base',
  templateUrl: './clonar-produtos-empresa-base.component.html',
  styleUrls: ['./clonar-produtos-empresa-base.component.scss'],
})
export class ClonarProdutosEmpresaBaseComponent extends Unsubscriber implements OnInit {

  produtos: Array<ProdutoEmpresaBase>;
  form: FormGroup;
  formProdutos: FormArray;
  categorias: Array<CategoriaProduto>;
  loadingCategorias: boolean;
  unidadesDeMedida: Array<UnidadeMedida>;
  loadingUnidadesDeMedida: boolean;

  constructor(
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private categoriaService: CategoriaProdutoService,
    private unidadeDeMedidaService: UnidadeMedidaService,
    private utilitiesService: UtilitiesService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
  ) {
    super();
  }

  ngOnInit() {
    this.construaForm();
    this.populeListas();
  }

  cloneProdutos() {
    if (this.form.valid) {
      this.activeModal.close(this.formProdutos.value);
    } else {
      this.utilitiesService.markControlAsDirty(this.formProdutos);
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  cancelar() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true, backdrop: 'static', keyboard: false });

    modalRef.componentInstance.confirmacao = 'Deseja cancelar a inclusão dos produtos?';
    modalRef.componentInstance.confirmarLabel = '  Sim  ';
    modalRef.componentInstance.confirmarBtnClass = 'btn-primary';
    modalRef.componentInstance.cancelarLabel = '  Não  ';
    modalRef.componentInstance.cancelarBtnClass = 'btn-outline-primary';

    modalRef.result.then((result) => {
      if (result) {
        this.activeModal.close(new Array<ProdutoEmpresaBase>());
      }
    });
  }

  removaProduto(index: number) {
    this.formProdutos.removeAt(index);
  }

  private construaForm() {
    this.form = this.fb.group({
      produtos: this.fb.array([]),
    });

    this.formProdutos = this.form.get('produtos') as FormArray;

    if (this.produtos && this.produtos.length > 0) {
      for (const produto of this.produtos) {
        this.formProdutos.push(this.fb.group({
          idProduto: [produto.idProduto],
          idCategoriaProduto: ['', Validators.required],
          idUnidadeMedida: ['', Validators.required],
          codigo: [''],
          descricao: [{ value: produto.descricao, disabled: true }],
        }));
      }
    }
  }

  private populeListas() {
    this.loadingCategorias = true;
    this.loadingUnidadesDeMedida = true;

    this.categoriaService.listarAtivasSemHierarquia().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.loadingCategorias = false))
      .subscribe((categorias) => this.categorias = categorias);

    this.unidadeDeMedidaService.listar().pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.loadingUnidadesDeMedida = false))
      .subscribe((unidadesDeMedida) => this.unidadesDeMedida = unidadesDeMedida);
  }

}
