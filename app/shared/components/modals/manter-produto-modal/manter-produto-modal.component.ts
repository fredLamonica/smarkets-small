import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  Arquivo, CategoriaMaterial, CategoriaProduto, ContaContabil, Marca, Moeda, OrigemMaterial, Produto, SituacaoProduto,
  TipoProduto, UnidadeMedida, UtilizacaoMaterial
} from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService, CategoriaMaterialService, CategoriaProdutoService,
  OrigemMaterialService, ProdutoService, TranslationLibraryService, UnidadeMedidaService, UtilizacaoMaterialService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ErrorService } from '../../../utils/error.service';
import { Unsubscriber } from '../../base/unsubscriber';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-produto-modal',
  templateUrl: './manter-produto-modal.component.html',
  styleUrls: ['./manter-produto-modal.component.scss'],
})
export class ManterProdutoModalComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // #region Enums
  TipoProduto = TipoProduto;
  SituacaoProduto = SituacaoProduto;
  Moeda = Moeda;
  // #endregion

  idProduto: number;
  descricao: string;
  descricaoDetalhada: string;
  codigo: string;
  codigoUnico: number;
  maiorCodigoUnico: number;
  ncm: string;
  valorReferencia: number;
  tipoProduto: TipoProduto = TipoProduto.Produto;

  codigoCategoriaProduto: string;
  nomeCategoriaProduto: string;

  siglaUnidadeMedida: string;
  codigoUnidadeMedida: string;
  descricaoUnidadeMedida: string;
  permiteQuantidadeFracionadaUnidadeMedida: boolean;

  form: FormGroup;

  unidadesMedida: Array<UnidadeMedida>;
  categoriasProduto: Array<CategoriaProduto>;

  codigoNcmObrigatorio: boolean;
  parametrosIntegracaoSapHabilitado: boolean;
  origemMaterialObrigatorio: boolean;
  utilizacaoMaterialObrigatorio: boolean;
  categoriaMaterialObrigatorio: boolean;

  unidadesMedida$: Observable<Array<OrigemMaterial>>;
  unidadesMedidaLoading = false;

  categoriasProduto$: Observable<Array<OrigemMaterial>>;
  categoriasProdutoLoading = false;
  // #endregion

  // #region Propriedades SAP
  origensMaterial$: Observable<Array<OrigemMaterial>>;
  origensMaterialLoading = false;

  utilizacaoMateriais$: Observable<Array<UtilizacaoMaterial>>;
  utilizacaoMateriaisLoading = false;

  categoriasMaterial$: Observable<Array<CategoriaMaterial>>;
  categoriasMaterialLoading = false;

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

  constructor(
    private translationLibrary: TranslationLibraryService,
    private produtoService: ProdutoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private categoriaProdutoService: CategoriaProdutoService,
    private origemMaterialService: OrigemMaterialService,
    private utilizacaoMaterialService: UtilizacaoMaterialService,
    private categoriaMaterialService: CategoriaMaterialService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private authService: AutenticacaoService,
    public activeModal: NgbActiveModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    this.subListas();
    this.obterParametros();
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const form = this.form.value;

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

      if (produto.idUnidadeMedida === 0) {
        produto.unidadeMedida = this.unidadesMedida.find(
          (um) => um.idUnidadeMedida === produto.idUnidadeMedida,
        );
      }

      if (produto.idCategoriaProduto === 0) {
        produto.categoria = this.categoriasProduto.find(
          (cp) => cp.idCategoriaProduto === produto.idCategoriaProduto,
        );
      }

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
        this.toastr.warning('O valor de referência não pode ser menor que zero.');
      } else {
        this.toastr.warning('O valor de referência não pode ser maior que R$ 999.999.999.999,99.');
      }
      return false;
    }

    if (this.form.controls.consumoMedio.invalid) {
      if (this.form.controls.consumoMedio.errors.min) {
        this.toastr.warning('O consumo médio não pode ser menor que zero.');
      } else {
        this.toastr.warning('O consumo médio não pode ser maior que R$ 999.999.999.999,99.');
      }
      return false;
    }

    if (!this.form.valid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  fechar() {
    this.activeModal.close();
  }

  naoExistemCategoriasDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
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

  // #endregion

  // #region Selecao de imagens
  async incluirImagens(imagens) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < imagens.length; i++) {
        imagens[i] = await this.arquivoService.inserir(imagens[i]).toPromise();
      }
      this.form.patchValue({
        imagens: this.form.controls.imagens.value.concat(imagens),
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  excluirImagens(imagem) {
    if (!this.idProduto) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.form.controls.anexos.value[imagem.index].idArquivo)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            const anexos = this.form.controls.anexos.value;
            anexos.splice(imagem.index, 1);
            this.form.patchValue({
              anexos: anexos,
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      const anexos = this.form.controls.anexos.value;
      anexos.splice(imagem.index, 1);
      this.form.patchValue({
        anexos: anexos,
      });
    }
  }

  private obterParametros() {
    if (this.idProduto) {
      this.obterProduto();
    } else {
      this.obterMaiorCodigoUnico();
    }
  }

  private obterProduto() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.obterPorId(this.idProduto)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.preencherFormulario(response);
          }
          this.obterMaiorCodigoUnico();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
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

  private contruirFormulario() {
    this.form = this.fb.group({
      idProduto: [0],
      idTenant: [0],
      idCategoriaProduto: [null, Validators.required],
      idUnidadeMedida: [null, Validators.required],
      situacao: [SituacaoProduto.Ativo, Validators.required],
      tipo: [this.tipoProduto, Validators.required],
      imagens: [new Array<Arquivo>()],
      anexos: [new Array<Arquivo>()],
      codigo: [this.codigo],
      codigoUnico: [{ value: '', disabled: true }],
      codigoNcm: [this.ncm],
      descricao: [this.descricao, Validators.required],
      descricaoDetalhada: [this.descricaoDetalhada],
      consumoMedio: [null, Validators.compose([Validators.min(0), Validators.max(999999999.9999)])],
      idSolicitante: [0],
      nomeSolicitante: [''],
      idGrupoDespesa: [null],
      idTipoDespesa: [null],
      dataUltimaCompra: [null],
      valorUltimaCompra: [null],
      valorReferencia: [
        this.valorReferencia,
        Validators.compose([Validators.min(0), Validators.max(999999999.9999)]),
      ],
      moeda: [Moeda.Real, Validators.required],
      idOrigemMaterial: [null],
      idUtilizacaoMaterial: [null],
      idCategoriaMaterial: [null],
      marcas: [new Array<Marca>()],
      contasContabeis: [new Array<ContaContabil>()],
      gerarCodigoUnicoAutomatico: [true],
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
    if (
      usuario &&
      usuario.permissaoAtual &&
      usuario.permissaoAtual.pessoaJuridica &&
      usuario.permissaoAtual.pessoaJuridica.codigoNcmObrigatorio
    ) {
      this.codigoNcmObrigatorio = true;
      this.form.controls.codigoNcm.setValidators([Validators.required]);
      this.form.controls.codigoNcm.updateValueAndValidity();
    }

    if (
      usuario &&
      usuario.permissaoAtual &&
      usuario.permissaoAtual.pessoaJuridica &&
      usuario.permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado
    ) {
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
    this.form.controls.tipo.disable();

    if (produto.idOrigemMaterial) { this.subOrigemMaterial(); }

    if (produto.idUtilizacaoMaterial) { this.subUtilizacaoMaterial(); }

    if (produto.idCategoriaMaterial) { this.subCategoriaMaterial(); }
  }

  private inserir(produto: Produto) {
    this.produtoService.inserir(produto, this.form.get('gerarCodigoUnicoAutomatico').value)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();

          this.activeModal.close(response);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private alterar(produto: Produto) {
    this.produtoService.alterar(produto)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();

          this.activeModal.close(response);
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  // #region Listas
  private subListas() {
    this.subUnidadesMedida();
    this.subCategoriasProduto();
  }

  private subUnidadesMedida() {
    this.unidadesMedidaLoading = true;
    this.unidadesMedida$ = this.unidadeMedidaService.listar().pipe(
      catchError(() => of([])),
      tap((unidades) => {
        if (unidades) {
          if (this.codigoUnidadeMedida) {
            let unidadeMedida = unidades.find((um) => um.codigo === this.codigoUnidadeMedida);
            if (!unidadeMedida) {
              if (this.siglaUnidadeMedida && this.descricaoUnidadeMedida) {
                unidadeMedida = new UnidadeMedida();
                unidadeMedida.idUnidadeMedida = 0;
                unidadeMedida.codigo = this.codigoUnidadeMedida;
                unidadeMedida.sigla = this.siglaUnidadeMedida;
                unidadeMedida.descricao = this.descricaoUnidadeMedida;
                unidadeMedida.permiteQuantidadeFracionada = this.permiteQuantidadeFracionadaUnidadeMedida;
                unidades.push(unidadeMedida);
              }
            }
            this.form.patchValue({ idUnidadeMedida: unidadeMedida.idUnidadeMedida });
          }
        }
        this.unidadesMedida = unidades;
        this.unidadesMedidaLoading = false;
        return unidades;
      }),
    );
  }

  private subCategoriasProduto() {
    this.categoriasProdutoLoading = true;
    this.categoriasProduto$ = this.categoriaProdutoService.listarAtivas().pipe(
      catchError(() => of([])),
      tap((categorias) => {
        if (categorias) {
          if (!this.codigoCategoriaProduto) {
            let categoriaProduto = categorias.find((cp) => cp.codigo === this.codigoCategoriaProduto);
            if (categoriaProduto) {
              if (this.nomeCategoriaProduto) {
                categoriaProduto = new CategoriaProduto(
                  0,
                  null,
                  this.codigoCategoriaProduto,
                  this.nomeCategoriaProduto,
                  true,
                  null,
                  null,
                  null,
                  null,
                  0,
                  null,
                  false,
                );

                categorias.push(categoriaProduto);
              }
              this.form.patchValue({ idCategoriaProduto: categoriaProduto.idCategoriaProduto });
            }
          }
        }
        this.categoriasProduto = categorias;
        this.categoriasProdutoLoading = false;
        return categorias;
      }),
    );
  }

  private subOrigemMaterial() {
    this.origensMaterialLoading = true;
    this.origensMaterial$ = this.origemMaterialService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.origensMaterialLoading = false)),
    );
  }

  private subUtilizacaoMaterial() {
    this.utilizacaoMateriaisLoading = true;
    this.utilizacaoMateriais$ = this.utilizacaoMaterialService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.utilizacaoMateriaisLoading = false)),
    );
  }

  private subCategoriaMaterial() {
    this.categoriasMaterialLoading = true;
    this.categoriasMaterial$ = this.categoriaMaterialService.listar().pipe(
      catchError(() => of([])),
      tap(() => (this.categoriasMaterialLoading = false)),
    );
  }
  //#endregion
}
