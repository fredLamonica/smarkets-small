import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  PessoaJuridica,
  CategoriaProduto,
  CustomTableSettings,
  CustomTableColumn,
  CustomTableColumnType,
  CategoriaFornecimento
} from '@shared/models';
import { ToastrService } from 'ngx-toastr';
import {
  TranslationLibraryService,
  PessoaJuridicaService,
  FornecedorService,
  AutenticacaoService
} from '@shared/providers';
import { ActivatedRoute, Router } from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-manter-fornecedor-cliente',
  templateUrl: './manter-fornecedor-cliente.component.html',
  styleUrls: ['./manter-fornecedor-cliente.component.scss']
})
export class ManterFornecedorClienteComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public maskCnpj = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/
  ];

  public idPessoaJuridica: number;
  private paramsSub: Subscription;

  public form: FormGroup;
  public pessoaJuridica: PessoaJuridica;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fornecedorService: FornecedorService,
    private autenticacaoService: AutenticacaoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.construirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idPessoaJuridica = +params['idPessoaJuridica'];
      if (this.idPessoaJuridica) this.obterPessoaJuridica();
      else this.blockUI.stop();
    });
  }

  private obterPessoaJuridica() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    let idPessoa = this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.idPessoa;
    this.fornecedorService.obterClientePorId(idPessoa, this.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
          this.pessoaJuridica = response;
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idPessoaJuridica: [0],
      cnpj: [''],
      razaoSocial: [''],
      nomeFantasia: [''],
      homePage: [''],
      logo: ['']
    });
  }

  private preencherFormulario(pessoaJuridica: PessoaJuridica) {
    this.form.patchValue(pessoaJuridica);
  }

  public voltar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  // #region Enderecos
  public exibirEnderecos: boolean;

  public permitirExibirEnderecos() {
    if (!this.exibirEnderecos) this.exibirEnderecos = true;
  }
  // #endregion

  // #region Categorias
  public exibirCategorias: boolean;

  public permitirExibirCategorias() {
    if (!this.exibirCategorias) {
      this.exibirCategorias = true;
      this.obterCategorias();
    }
  }

  public categorias: Array<CategoriaFornecimento>;

  public settings: CustomTableSettings = new CustomTableSettings(
    [
      new CustomTableColumn('#', 'idCategoriaFornecimento', CustomTableColumnType.text, null, null),
      new CustomTableColumn('Código', 'codigo', CustomTableColumnType.text, null, null),
      new CustomTableColumn('Categoria', 'descricao', CustomTableColumnType.text, null, null)
    ],
    'none'
  );

  private obterCategorias() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.obterCategoriasPorCliente(this.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.categorias = response;
        } else {
          this.categorias = new Array<CategoriaFornecimento>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  // #endregion
}
