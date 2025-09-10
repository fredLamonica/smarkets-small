import { CategoriaFornecimento } from './../../../shared/models/categoria-fornecimento/categoria-fornecimento';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  TranslationLibraryService,
  ConfiguracaoFornecedorInteressadoService,
  CategoriaProdutoService,
  FornecedorService,
  CategoriaFornecimentoService,
  PessoaJuridicaService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UniversalValidators } from 'ng2-validators';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import {
  CategoriaProduto,
  ConfiguracaoFornecedorInteressado,
  PessoaJuridica,
  StatusFornecedor
} from '@shared/models';
import { FornecedorInteressado } from '@shared/models/fornecedor-interessado';
import { OrigemFornecedor } from '@shared/models/enums/origem-fornecedor';
import { CategoriaFornecimentoInteresse } from '@shared/models/categoria-fornecimento/categoria-fornecimento-interesse';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'registrar-interesse',
  templateUrl: './registrar-interesse.component.html',
  styleUrls: ['./registrar-interesse.component.scss']
})
export class RegistrarInteresseComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('ngSelectCategoriaFornecimento') ngSelectCategoriaFornecimento: NgSelectComponent;

  public form: FormGroup;
  public returnUrl: string;
  public idTenant: number;
  public passwordInputType: string;
  public configuracaoFornecedorInteressado: ConfiguracaoFornecedorInteressado;
  private paramsSub: Subscription;
  public url: string;
  public logo: string;
  public textoCustomizavel: string;
  public maskTelefone = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
  public maskCelular = [
    '(',
    /\d/,
    /\d/,
    ')',
    ' ',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
    /\d/,
    /\d/
  ];
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
  public categorias: Array<CategoriaProduto>;
  public outrasCategoriaDescricao = 'Outras';
  public categoriasFornecimentoInteresse = new Set<string>();
  public clientesInteresse: Array<PessoaJuridica>;
  public categoriasFornecimento: Array<CategoriaFornecimento> = new Array<CategoriaFornecimento>();
  public readonly tenantMaster = 1;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private configuracaoFornecedorInteressadoService: ConfiguracaoFornecedorInteressadoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private categoriaFornecimentoService: CategoriaFornecimentoService,
    private router: Router,
    private fornecedorService: FornecedorService,
    private pessoaJuridicaService: PessoaJuridicaService
  ) {}

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.criarFormulario();

    try {
      this.obterParametros();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.url = params['url'];

      if (this.url) {
        this.obterConfiguracao();
      } else {
        this.blockUI.stop();
      }
    });
  }

  private obterConfiguracao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoFornecedorInteressadoService.obterPorUrl(this.url).subscribe(
      response => {
        if (response) {
          this.configuracaoFornecedorInteressado = response;
          this.preencherFormulario(response);
          this.obterClientesInteresse();
          this.obterCategoriasFornecimentoPorTenant(
            this.configuracaoFornecedorInteressado.idTenant
          );
        } else {
          this.router.navigate(['/404']);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public obterClientesInteresse() {
    this.pessoaJuridicaService.ObterCompradores().subscribe(response => {
      if (response) {
        this.clientesInteresse = response;
      }

      this.blockUI.stop();
    });
  }

  public obterCategoriasFornecimento(pessoasJuridica: PessoaJuridica) {
    this.categoriasFornecimento = new Array<CategoriaFornecimento>();

    this.ngSelectCategoriaFornecimento.clearModel();

    let tenant = pessoasJuridica
      ? pessoasJuridica.idTenant
      : this.configuracaoFornecedorInteressado.idTenant;

    this.categoriasFornecimentoInteresse.clear();

    this.obterCategoriasFornecimentoPorTenant(tenant);
  }

  private obterCategoriasFornecimentoPorTenant(idTenant: number) {
    this.categoriaFornecimentoService.listarPorTenant(idTenant).subscribe(
      response => {
        if (response) {
          this.categoriasFornecimento = response;
        }
        this.incluirCategoriaOutras();
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private incluirCategoriaOutras() {
    let outras = new CategoriaFornecimento();
    outras.descricao = this.outrasCategoriaDescricao;
    this.categoriasFornecimento.push(outras);
  }

  private preencherFormulario(
    configuracaoFornecedorInteressado: ConfiguracaoFornecedorInteressado
  ) {
    this.logo = configuracaoFornecedorInteressado.logo;
    this.textoCustomizavel = configuracaoFornecedorInteressado.textoCustomizavel;
    this.form.patchValue(configuracaoFornecedorInteressado);
  }

  private criarFormulario() {
    this.form = this.formBuilder.group({
      clienteInteresse: [null],
      cnpj: ['', Validators.compose([Validators.required, CustomValidators.cnpj])],
      razaoSocial: [
        '',
        Validators.compose([Validators.required, UniversalValidators.noEmptyString])
      ],
      nomeFantasia: [
        '',
        Validators.compose([Validators.required, UniversalValidators.noEmptyString])
      ],
      contato: ['', Validators.compose([Validators.required, UniversalValidators.noEmptyString])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      categoriasFornecimento: [new Array<CategoriaFornecimento>(), Validators.required],
      CategoriaFornecimentoInteresse: ['']
    });
  }

  public registrarInteresse() {
    if (this.form.valid) {
      let fornecedor: FornecedorInteressado = this.cloneObject(this.form.value);

      fornecedor.idTenant = this.form.value.clienteInteresse
        ? this.form.value.clienteInteresse.idTenant
        : this.configuracaoFornecedorInteressado.idTenant;
      fornecedor.status = StatusFornecedor.Novo;
      fornecedor.origem = OrigemFornecedor.Interessado;
      fornecedor.possuiCategoriaFornecimentoInteresse = false;

      if (this.outrasCategoriaSelected()) {
        if (!this.possuiCategoriaFornecimentoInteresse()) {
          this.toastr.warning(
            "Adicione uma categoria de fornecimento desejada ou remova a opção 'Outras'"
          );
          return;
        }
        fornecedor.possuiCategoriaFornecimentoInteresse = true;
        fornecedor.categoriasFornecimento = fornecedor.categoriasFornecimento.filter(
          p => p.descricao != this.outrasCategoriaDescricao
        );
        fornecedor.categoriaFornecimentoInteresses = new Array<CategoriaFornecimentoInteresse>();

        this.categoriasFornecimentoInteresse.forEach(categoria => {
          fornecedor.categoriaFornecimentoInteresses.push(
            new CategoriaFornecimentoInteresse(categoria, fornecedor.idTenant)
          );
        });
      }

      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.inserir(fornecedor);
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private cloneObject(obj) {
    var copy;

    if (null == obj || 'object' != typeof obj) return obj;

    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.cloneObject(obj[i]);
      }
      return copy;
    }

    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.cloneObject(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  private inserir(fornecedor: FornecedorInteressado) {
    this.fornecedorService.inserirFornecedorInteressado(fornecedor).subscribe(
      response => {
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.form.reset({
          cnpj: '',
          razaoSocial: '',
          nomeFantasia: '',
          contato: '',
          email: '',
          categoriasFornecimento: '',
          CategoriaFornecimentoInteresse: ''
        });

        this.categoriasFornecimentoInteresse.clear();
        this.obterCategoriasFornecimentoPorTenant(this.configuracaoFornecedorInteressado.idTenant);
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

  private possuiCategoriaFornecimentoInteresse(): boolean {
    return this.categoriasFornecimentoInteresse && this.categoriasFornecimentoInteresse.size > 0;
  }

  public outrasCategoriaSelected(): boolean {
    let categorias = Array.from<CategoriaFornecimento>(this.form.value.categoriasFornecimento);
    return categorias.some(p => p.descricao == this.outrasCategoriaDescricao);
  }

  public adicionarCagoriaFornecimento() {
    let categoriaAdicionada = this.form.value.CategoriaFornecimentoInteresse;

    if (categoriaAdicionada && categoriaAdicionada.trim()) {
      this.categoriasFornecimentoInteresse.add(categoriaAdicionada);
    }

    this.form.patchValue({
      CategoriaFornecimentoInteresse: ''
    });
  }

  public removerCategoriaFornecimentoInteresse(valor: string) {
    this.categoriasFornecimentoInteresse.delete(valor);
  }

  public cpfCnpjMask(value: string) {
    var numbers = value.match(/\d/g);
    var numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength <= 11) {
      return [
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        '.',
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        '.',
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        '-',
        /[0-9]/,
        /[0-9]/
      ];
    } else {
      return [
        /[0-9]/,
        /[0-9]/,
        '.',
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        '.',
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        '/',
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        /[0-9]/,
        '-',
        /[0-9]/,
        /[0-9]/
      ];
    }
  }
}
