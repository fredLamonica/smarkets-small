import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslationLibraryService, CategoriaProdutoService, CnaeService } from '@shared/providers';
import { CategoriaProduto, TipoCategoriaProduto, ClassificacaoCategoriaProduto, Cnae } from '@shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelecionarIconeCategoriaComponent } from '../selecionar-icone-categoria/selecionar-icone-categoria.component';

@Component({
  selector: 'app-manter-categoria-produto',
  templateUrl: './manter-categoria-produto.component.html',
  styleUrls: ['./manter-categoria-produto.component.scss']
})
export class ManterCategoriaProdutoComponent implements OnInit, OnDestroy {

  //TODO: Componente de exibição de fornecedores vinculados

  public TipoCategoriaProduto = TipoCategoriaProduto;
  public ClassificacaoCategoriaProduto = ClassificacaoCategoriaProduto;

  @BlockUI() blockUI: NgBlockUI;

  public idCategoria: number;
  private paramsSub: Subscription;
  public form: FormGroup;

  public categorias: Array<CategoriaProduto>;
  public cnaes: Array<Cnae>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private categoriaService: CategoriaProdutoService,
    private cnaeService: CnaeService,
    private modalService: NgbModal
  ) { }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    try {
      this.categorias = await this.obterCategorias();    
      this.cnaes = await this.obterCnaes();  
      this.obterParametros();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(
      params => {
        this.idCategoria = params["idCategoria"];

        if (this.idCategoria)
          this.obterCategoria();
        else 
          this.blockUI.stop();
      }
    );
  }

  private obterCategoria() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaService.obterPorId(this.idCategoria).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCategoriaProduto: [0],
      idTenant: [0],
      idCategoriaProdutoPai: [null],
      codigo: [''],
      nome: ['', Validators.required],
      regulamentacao: [false, Validators.required],
      situacao: [true, Validators.required],
      classificacao: [null],
      tipo: [null],
      idCnae: [null],
      classeIcone: [null]
    });
  }

  private preencherFormulario(categoria: CategoriaProduto) {
    this.form.patchValue(categoria);
  }

  public salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING)
    if (this.formularioValido()) {
      let categoria: CategoriaProduto = this.form.value;
      if (this.idCategoria)
        this.alterar(categoria);
      else
        this.inserir(categoria);
    }
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
      return false;
    }
    if(this.idCategoria && this.idCategoria == this.form.value.idCategoriaProdutoPai) {
      this.toastr.warning("Você selecionou uma categoria de produto pai inválida, por favor selecione outra!");
      this.blockUI.stop();
      return false;
    }
    return true;
  }

  private inserir(categoria: CategoriaProduto) {
    this.categoriaService.inserir(categoria).subscribe(
      response => {
        if (response) {
          this.router.navigate(["/categorias-produto/", response.idCategoriaProduto]);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  private alterar(categoria: CategoriaProduto) {
    this.categoriaService.alterar(categoria).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop()
      }
    );
  }

  public cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  private async obterCategorias(): Promise<Array<CategoriaProduto>>{
    return this.categoriaService.listar().toPromise();
  }

  private async obterCnaes(): Promise<Array<Cnae>>{
    return this.cnaeService.listar().toPromise();
  }

  public naoExistemCategoriasDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
  }

  public selecionarIcone() {
    const modalRef = this.modalService.open(SelecionarIconeCategoriaComponent, { centered: true, size: "lg" });
    modalRef.componentInstance.iconeSelecionado = this.form.value.classeIcone;
    modalRef.result.then(
      iconeSelecionado => {
        if (iconeSelecionado) {
          this.form.controls.classeIcone.setValue(iconeSelecionado);
        }
      }
    );
  }

  public limparIcone(){
    this.form.controls.classeIcone.reset();
  }

}
