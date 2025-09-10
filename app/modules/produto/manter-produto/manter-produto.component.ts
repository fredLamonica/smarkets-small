import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Arquivo, CategoriaMaterial, CategoriaProduto, ContaContabil, GrupoDespesa, Marca, Moeda, OrigemMaterial, PerfilUsuario, Produto, SituacaoProduto, TipoDespesa, TipoProduto, UnidadeMedida, Usuario, UtilizacaoMaterial } from '@shared/models';
import { TipoIntegracaoErp } from '@shared/models/enums/tipo-integracao-erp';
import { IntegracaoErp } from '@shared/models/integracao-com-erp/integracao-erp';
import { ArquivoService, AutenticacaoService, CategoriaMaterialService, CategoriaProdutoService, GrupoDespesaService, OrigemMaterialService, ProdutoService, TipoDespesaService, TranslationLibraryService, UnidadeMedidaService, UtilizacaoMaterialService } from '@shared/providers';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { PrecificacaoProdutoIA } from '../../../shared/models/precificacao-produto-ia';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-produto',
  templateUrl: './manter-produto.component.html',
  styleUrls: ['./manter-produto.component.scss'],
})
export class ManterProdutoComponent extends Unsubscriber implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;

  readonly tipoIntegracaoErp: TipoIntegracaoErp = TipoIntegracaoErp.produto;

  TipoProduto = TipoProduto;
  SituacaoProduto = SituacaoProduto;

  idProduto: number;
  form: FormGroup;

  unidadesMedida: Array<UnidadeMedida>;
  gruposDespesa: Array<GrupoDespesa>;
  tiposDespesa: Array<TipoDespesa>;
  categorias: Array<CategoriaProduto>;
  precificacaoProduto: PrecificacaoProdutoIA;
  Moeda = Moeda;

  maiorCodigoUnico: number;
  codigoNcmObrigatorio: boolean;
  parametrosIntegracaoSapHabilitado: boolean;
  origemMaterialObrigatorio: boolean;
  utilizacaoMaterialObrigatorio: boolean;
  categoriaMaterialObrigatorio: boolean;

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12,
  });

  origensMaterial$: Observable<Array<OrigemMaterial>>;
  origensMaterialLoading = false;

  utilizacaoMateriais$: Observable<Array<UtilizacaoMaterial>>;
  utilizacaoMateriaisLoading = false;

  categoriasMaterial$: Observable<Array<CategoriaMaterial>>;
  categoriasMaterialLoading = false;

  disponibilizarIntegracaoErp: boolean;

  maskCodigoUnico = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    allowDecimal: false,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9,
  });

  private paramsSub: Subscription;

  // TODO: Criar Componente de Padronização
  // TODO: Criar Componente de Exibição de forncedores
  // TODO: Melhorar funcionalidade de download de arquivos
  // TODO: Criar Componente de exibição de itens semelhantes

  constructor(
    private translationLibrary: TranslationLibraryService,
    private produtoService: ProdutoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private grupoDespesaService: GrupoDespesaService,
    private tipoDespesaService: TipoDespesaService,
    private categoriaProdutoService: CategoriaProdutoService,
    private origemMaterialService: OrigemMaterialService,
    private utilizacaoMaterialService: UtilizacaoMaterialService,
    private categoriaMaterialService: CategoriaMaterialService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private authService: AutenticacaoService,
    private errorService: ErrorService,
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const usuario: Usuario = this.authService.usuario();
    this.disponibilizarIntegracaoErp =
      (usuario.permissaoAtual.isSmarkets || (usuario.permissaoAtual.pessoaJuridica && usuario.permissaoAtual.pessoaJuridica.habilitarIntegracaoERP)) &&
      (usuario.permissaoAtual.perfil === PerfilUsuario.Administrador || usuario.permissaoAtual.perfil === PerfilUsuario.Gestor || usuario.permissaoAtual.perfil === PerfilUsuario.Cadastrador);

    this.contruirFormulario();
    await this.obterListas();
    this.obterParametros();
  }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      await this.salvarImagens();

      const form = this.removerMascaras(this.form.getRawValue());

      const produto = new Produto(
        form.idProduto,
        form.idTenant,
        form.idCategoriaProduto,
        form.idUnidadeMedida,
        form.situacao,
        form.tipo,
        form.imagens,
        form.codigo,
        form.codigoNcm,
        form.descricao,
        form.descricaoDetalhada,
        form.consumoMedio,
        null,
        null,
        form.valorReferencia,
        form.moeda,
        form.idSolicitante,
        null,
        null,
        form.idGrupoDespesa,
        form.idTipoDespesa,
        form.idOrigemMaterial,
        form.idUtilizacaoMaterial,
        form.idCategoriaMaterial,
      );

      produto.integracoesErp = form.integracoesErp;
      produto.codigoUnico = form.codigoUnico;

      if (this.idProduto) {
        this.alterar(produto);
      } else {
        this.inserir(produto);
      }
    } else {
      this.blockUI.stop();
    }
  }

  formularioValido(): boolean {
    if (this.form.controls.valorReferencia.invalid) {
      if (this.form.controls.valorReferencia.errors.min) {
        this.toastr.warning(
          'O valor de referência não pode ser menor que zero.',
        );
      } else {
        this.toastr.warning(
          'O valor de referência não pode ser maior que R$ 999.999.999.999,99.',
        );
      }
      return false;
    }

    if (this.form.controls.consumoMedio.invalid) {
      if (this.form.controls.consumoMedio.errors.min) {
        this.toastr.warning('O consumo médio não pode ser menor que zero.');
      } else {
        this.toastr.warning(
          'O consumo médio não pode ser maior que R$ 999.999.999.999,99.',
        );
      }
      return false;
    }

    if (!this.form.valid) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS,
      );
      return false;
    }

    return true;
  }

  cancelar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  async obterListas() {
    try {
      this.unidadesMedida = await this.obterUnidadesMedida();
      this.gruposDespesa = await this.obterGruposDespesa();
      this.tiposDespesa = await this.obterTiposDespesa();
      this.categorias = await this.obterCategorias();
    } catch {
      this.toastr.error(
        this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
      );
      this.blockUI.stop();
    }
  }

  async obterUnidadesMedida(): Promise<Array<UnidadeMedida>> {
    return this.unidadeMedidaService.listar().toPromise();
  }
  async obterGruposDespesa(): Promise<Array<GrupoDespesa>> {
    return this.grupoDespesaService.listar().toPromise();
  }
  async obterTiposDespesa(): Promise<Array<TipoDespesa>> {
    return this.tipoDespesaService.listar().toPromise();
  }
  async obterCategorias(): Promise<Array<CategoriaProduto>> {
    return this.categoriaProdutoService.listarAtivas().toPromise();
  }

  naoExistemCategoriasDisponiveis(event) {
    this.toastr.warning(
      this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE,
    );
  }

  openOrigemMaterial() {
    if (this.origensMaterial$ == null) {
      this.subOrigemMaterial();
    }
  }

  openUtilizacaoMaterial() {
    if (this.utilizacaoMateriais$ == null) {
      this.subUtilizacaoMaterial();
    }
  }

  openCategoriaMaterial() {
    if (this.categoriasMaterial$ == null) {
      this.subCategoriaMaterial();
    }
  }

  //#region  Marcas
  atualizarMarcas(marcas: Array<Marca>) {
    this.form.patchValue({ marcas: marcas });
  }
  //#endregion

  //#region Contas Contábeis
  atualizarContas(contas: Array<ContaContabil>) {
    this.form.patchValue({ contasContabeis: contas });
  }
  //#endregion

  //#region Anexos
  atualizarAnexos(arquivos: Array<Arquivo>) {
    this.form.patchValue({ anexos: arquivos });
  }

  //#endregion

  // #region Selecao de imagens
  async imagensSelecionadas(arquivos: Array<Arquivo>) {
    try {
      if (this.idProduto) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        for (let i = 0; i < arquivos.length; i++) {
          arquivos[i] = await this.salvarArquivo(arquivos[i]);
          await this.salvarProdutoArquivo(
            this.idProduto,
            arquivos[i].idArquivo,
          );
        }
        this.toastr.success(
          this.translationLibrary.translations.ALERTS.SUCCESS,
        );
        this.blockUI.stop();
      }

      let imagens = this.form.value.imagens;
      if (!imagens) { imagens = new Array<Arquivo>(); }
      imagens = imagens.concat(arquivos);
      this.form.patchValue({ imagens: imagens });
    } catch {
      this.toastr.error(
        this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
      );
      this.blockUI.stop();
    }
  }

  async removerImagem(index: number) {
    try {
      const imagens = this.form.value.imagens;

      if (this.idProduto && imagens[index].idArquivo) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        await this.deletarProdutoArquivo(
          this.idProduto,
          imagens[index].idArquivo,
        );
        this.toastr.success(
          this.translationLibrary.translations.ALERTS.SUCCESS,
        );
        this.blockUI.stop();
      }

      imagens.splice(index, 1);
      this.form.patchValue({ imagens: imagens });
    } catch {
      this.toastr.error(
        this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
      );
      this.blockUI.stop();
    }
  }

  async salvarImagens() {
    let formImagens = this.form.value.imagens;
    const imagens = formImagens.filter((i) => !i.idArquivo);
    if (imagens) {
      for (let i = 0; i < imagens.length; i++) {
        imagens[i] = await this.salvarArquivo(imagens[i]);
      }
      formImagens = formImagens.filter((i) => i.idArquivo);
      if (formImagens) {
        this.form.patchValue({ imagens: formImagens.concat(imagens) });
      } else {
        this.form.patchValue({ imagens: imagens });
      }
    }
  }

  async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  async salvarProdutoArquivo(idProduto: number, idArquivo: number) {
    return this.produtoService.inserirArquivo(idProduto, idArquivo).toPromise();
  }

  async deletarProdutoArquivo(idProduto: number, idArquivo: number) {
    return this.produtoService.deletarArquivo(idProduto, idArquivo).toPromise();
  }

  formateValores(precificacao: PrecificacaoProdutoIA) {
    precificacao.precoMedio = this.currencyPipe.transform(precificacao.precoMedio, undefined, '', '1.2-2', 'pt-BR').trim();
    precificacao.precoMinimo = this.currencyPipe.transform(precificacao.precoMinimo, undefined, '', '1.2-2', 'pt-BR').trim();
    precificacao.dataOutput = this.datePipe.transform(precificacao.dataOutput, 'yyyy-MM-dd');

    return precificacao;
  }

  private obterMaiorCodigoUnico() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.obterMaiorCodigoUnico().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.maiorCodigoUnico = (response);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idProduto = params['idProduto'];

        if (this.idProduto) {
          this.obterProduto();
        } else {
          this.form.patchValue({ gerarCodigoUnicoAutomatico: true });
          this.obterMaiorCodigoUnico();
        }
      });
  }

  private obterProduto() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.obterPorId(this.idProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.obtenhaPrecificacaoProduto();
            this.preencherFormulario(response);
          }
          this.obterMaiorCodigoUnico();
        },
        (error) => {
          this.toastr.error(
            this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR,
          );
          this.blockUI.stop();
        },
      );
  }

  private obtenhaPrecificacaoProduto() {
    this.produtoService.obtenhaPrecificacaoProduto(this.idProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.precificacaoProduto = this.formateValores(response);
          }
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idProduto: [0],
      idTenant: [0],
      idCategoriaProduto: [0, Validators.required],
      idUnidadeMedida: [null, Validators.required],
      situacao: [SituacaoProduto.Solicitação, Validators.required],
      tipo: [TipoProduto.Produto, Validators.required],
      imagens: [new Array<Arquivo>()],
      anexos: [new Array<Arquivo>()],
      codigo: [''],
      codigoUnico: [{ value: '', disabled: true }],
      codigoNcm: [null, CustomValidators.ncm],
      descricao: ['', Validators.required],
      descricaoDetalhada: [''],
      especificacao: [{ value: '', disabled: true }],
      consumoMedio: [null, Validators.compose([Validators.min(0), Validators.max(999999999.9999)])],
      idSolicitante: [0],
      nomeSolicitante: [''],
      idGrupoDespesa: [null],
      idTipoDespesa: [null],
      dataUltimaCompra: [null],
      valorUltimaCompra: [null],
      valorReferencia: [null, Validators.compose([Validators.min(0), Validators.max(999999999.9999)])],
      moeda: [Moeda.Real, Validators.required],
      idOrigemMaterial: [null],
      idUtilizacaoMaterial: [null],
      idCategoriaMaterial: [null],
      marcas: [new Array<Marca>()],
      contasContabeis: [new Array<ContaContabil>()],
      integracoesErp: [new Array<IntegracaoErp>()],
      gerarCodigoUnicoAutomatico: [false],
    });

    this.form.get('gerarCodigoUnicoAutomatico').valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((value) => {
        const codigoUnicoControl = this.form.get('codigoUnico');

        if (value) {
          codigoUnicoControl.disable();
          this.form.patchValue({ codigoUnico: '' });
        } else {
          codigoUnicoControl.enable();
        }
      });

    const usuario = this.authService.usuario();
    if (usuario && usuario.permissaoAtual && usuario.permissaoAtual.pessoaJuridica && usuario.permissaoAtual.pessoaJuridica.codigoNcmObrigatorio) {
      this.codigoNcmObrigatorio = true;
      this.form.controls.codigoNcm.setValidators(Validators.compose([Validators.required, CustomValidators.ncm]));
      this.form.controls.codigoNcm.updateValueAndValidity();
    }

    if (usuario && usuario.permissaoAtual && usuario.permissaoAtual.pessoaJuridica && usuario.permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado) {
      this.parametrosIntegracaoSapHabilitado = true;

      if (usuario.permissaoAtual.pessoaJuridica.origemMaterialObrigatorio) {
        this.origemMaterialObrigatorio = true;
        this.form.controls.idOrigemMaterial.setValidators([Validators.required]);
        this.form.controls.idOrigemMaterial.updateValueAndValidity();
      }

      if (usuario.permissaoAtual.pessoaJuridica.utilizacaoMaterialObrigatorio) {
        this.utilizacaoMaterialObrigatorio = true;
        this.form.controls.idUtilizacaoMaterial.setValidators([Validators.required]);
        this.form.controls.idUtilizacaoMaterial.updateValueAndValidity();
      }

      if (usuario.permissaoAtual.pessoaJuridica.categoriaMaterialObrigatorio) {
        this.categoriaMaterialObrigatorio = true;
        this.form.controls.idCategoriaMaterial.setValidators([Validators.required]);
        this.form.controls.idCategoriaMaterial.updateValueAndValidity();
      }
    }
  }

  private preencherFormulario(produto: Produto) {
    this.form.patchValue(this.adicionarMascaras(produto));

    this.form.controls.tipo.disable();

    if (produto.idOrigemMaterial) {
      this.subOrigemMaterial();
    }

    if (produto.idUtilizacaoMaterial) {
      this.subUtilizacaoMaterial();
    }

    if (produto.idCategoriaMaterial) {
      this.subCategoriaMaterial();
    }
  }

  private removerMascaras(produto: any): Produto {
    // Utiliza expressão regular para remover todos os pontos da string

    if (produto.valorReferencia) {
      produto.valorReferencia = +produto.valorReferencia
        .replace(/\./g, '')
        .replace(',', '.');
    }

    if (produto.consumoMedio) {
      produto.consumoMedio = +produto.consumoMedio
        .replace(/\./g, '')
        .replace(',', '.');
    }
    return produto;
  }

  private adicionarMascaras(produto: any) {
    if (produto.valorReferencia) {
      produto.valorReferencia = this.currencyPipe
        .transform(produto.valorReferencia, undefined, '', '1.2-4', 'pt-BR')
        .trim();
    } else {
      produto.valorReferencia = '';
    }

    if (produto.consumoMedio) {
      produto.consumoMedio = this.currencyPipe
        .transform(produto.consumoMedio, undefined, '', '1.2-4', 'pt-BR')
        .trim();
    } else {
      produto.consumoMedio = '';
    }

    return produto;
  }

  private inserir(produto: Produto) {
    this.produtoService.inserir(produto, this.form.get('gerarCodigoUnicoAutomatico').value).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/produtos/', response.idProduto]);
          }
          this.toastr.success(
            this.translationLibrary.translations.ALERTS.SUCCESS,
          );
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private alterar(produto: Produto) {
    this.produtoService.alterar(produto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(
            this.translationLibrary.translations.ALERTS.SUCCESS,
          );
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private subOrigemMaterial() {
    this.origensMaterialLoading = true;
    this.origensMaterial$ = this.origemMaterialService.listar().pipe(
      catchError(() => of([])),
      tap(() => this.origensMaterialLoading = false),
    );
  }

  private subUtilizacaoMaterial() {
    this.utilizacaoMateriaisLoading = true;
    this.utilizacaoMateriais$ = this.utilizacaoMaterialService.listar().pipe(
      catchError(() => of([])),
      tap(() => this.utilizacaoMateriaisLoading = false),
    );
  }

  private subCategoriaMaterial() {
    this.categoriasMaterialLoading = true;
    this.categoriasMaterial$ = this.categoriaMaterialService.listar().pipe(
      catchError(() => of([])),
      tap(() => this.categoriasMaterialLoading = false),
    );
  }
  //#endregion
}
