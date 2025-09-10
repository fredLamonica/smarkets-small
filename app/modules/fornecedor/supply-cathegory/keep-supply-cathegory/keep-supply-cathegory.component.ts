import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  AutenticacaoService,
  TranslationLibraryService,
  CategoriaFornecimentoService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { CategoriaFornecimento } from '@shared/models';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'keep-supply-cathegory-component',
  templateUrl: './keep-supply-cathegory.component.html',
  styleUrls: ['./keep-supply-cathegory.component.scss']
})
export class KeepSupplyCathegoryComponent implements OnInit {
  public idCategoriaFornecimento: number;
  public form: FormGroup;
  @BlockUI() blockUI: NgBlockUI;
  private paramsSub: Subscription;
  public visualizarCategoriasProduto = false;

  constructor(
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private authService: AutenticacaoService,
    private fb: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.contruirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCategoriaFornecimento: [0],
      codigo: [''],
      descricao: ['', Validators.required],
      idTenant: [0]
    });
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idCategoriaFornecimento = params['idCategoriaFornecimento'];

      if (this.idCategoriaFornecimento) this.obterCategoriaFornecimento();
      else this.blockUI.stop();
    });
  }

  private obterCategoriaFornecimento() {
    if (this.idCategoriaFornecimento) {
      this.categoriaFornecimentoService.obterPorId(this.idCategoriaFornecimento).subscribe(
        response => {
          if (response) {
            this.preencherFormulario(response);
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  private preencherFormulario(categoria: CategoriaFornecimento) {
    this.form.patchValue(categoria);
  }

  public cancelar() {
    this.router.navigate(['./..'], { relativeTo: this.route });
  }

  public salvar() {
    if (this.form.valid && !this.isNullOrWhitespace(this.form.getRawValue().descricao)) {
      if (this.idCategoriaFornecimento) {
        this.alterar();
      } else {
        this.adicionar();
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  public adicionar() {
    let categoriaFornecimento: CategoriaFornecimento = this.form.getRawValue();
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService.inserir(categoriaFornecimento).subscribe(
      response => {
        this.idCategoriaFornecimento = response.idCategoriaFornecimento;
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        switch (error.error) {
          case 'Já existe uma categoria de fornecimento com o código ' +
            categoriaFornecimento.codigo.trim():
          case 'Já existe uma categoria de fornecimento com essa descrição':
            this.toastr.warning(error.error);
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            break;
        }
        this.blockUI.stop();
      }
    );
  }

  public alterar() {
    let categoriaFornecimento: CategoriaFornecimento = this.form.getRawValue();
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaFornecimentoService.alterar(categoriaFornecimento).subscribe(
      response => {
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        switch (error.error) {
          case 'Já existe uma categoria de fornecimento com o código ' +
            categoriaFornecimento.codigo.trim():
          case 'Já existe uma categoria de fornecimento com essa descrição':
            this.toastr.error(error.error);
            break;
          default:
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            break;
        }
        this.blockUI.stop();
      }
    );
  }

  public permitirVisualizarCategoriasProduto() {
    this.visualizarCategoriasProduto = true;
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }
}
