import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ContratoCatalogoItem, Garantia, Marca, Moeda, Paginacao, Produto, SituacaoContratoCatalogoItem, TipoFrete, TipoProduto, UnidadeMedida } from '@shared/models';
import { ProdutoService, TranslationLibraryService, UnidadeMedidaService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { concat, Observable, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ContratoCatalogoItemEstado } from '../../../../shared/models/contrato-catalogo/contrato-catalogo-item-estado';
import { NcmFiltro } from '../../../../shared/models/fltros/ncm-filtro';
import { Ncm } from '../../../../shared/models/ncm';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { NcmService } from '../../../../shared/providers/ncm.service';
import { UtilitiesService } from '../../../../shared/utils/utilities.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-item-contrato',
  templateUrl: './manter-item-contrato.component.html',
  styleUrls: ['./manter-item-contrato.component.scss'],
})
export class ManterItemContratoComponent extends Unsubscriber implements OnInit, AfterViewInit {
  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;
  @Input() idFornecedor: number;
  @Input() idItem: number;

  @BlockUI() blockUI: NgBlockUI;
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
    integerLimit: 9,
  });

  maskPositiveInteger = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: null,
    allowDecimal: false,
    decimalSymbol: ',',
    decimalLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9,
  });

  maskImposto = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 3,
  });

  Moeda = Moeda;
  Garantia = Garantia;
  TipoFrete = TipoFrete;

  permitirLoteMinimoFracionado: boolean = true;
  min: number;
  max: number;

  SituacaoContratoCatalogoItem = SituacaoContratoCatalogoItem;
  form: FormGroup;

  unidadesMedida: Array<UnidadeMedida>;
  marcas: Array<Marca>;
  impostosHabilitados: boolean;

  ncmInput$ = new Subject<string>();
  ncmLoading: boolean;
  ncmFiltro: NcmFiltro = new NcmFiltro();
  textoNgSelectLoading: string = 'Carregando';
  estadosItem: Array<ContratoCatalogoItemEstado> = new Array<ContratoCatalogoItemEstado>();

  ncm$: Observable<Array<Ncm>>;

  private subProduto: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private contratoService: ContratoCatalogoService,
    private unidadeMedidaService: UnidadeMedidaService,
    private produtoService: ProdutoService,
    public activeModal: NgbActiveModal,
    private currencyPipe: CurrencyPipe,
    private decimalPipe: DecimalPipe,
    private errorService: ErrorService,
    private utilitiesService: UtilitiesService,
    private ncmService: NcmService,
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    this.subscribeProduto();
    this.assineEventoDePesquisaDeNCM();
    await this.obterListas();
    if (this.idItem) { this.obterItem(); } else { this.blockUI.stop(); }
  }

  ngAfterViewInit() { }

  async salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {
      const item: ContratoCatalogoItem = this.removerMascaras(this.form.value);

      item.estadosItem = this.estadosItem;
      item.idFornecedor = this.idFornecedor;

      if (this.idItem)
        this.alterar(item);
      else
        this.inserir(item);

    } else {
      this.blockUI.stop();
    }
  }

  cancelar() {
    this.activeModal.close();
  }

  private obterItem() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.obterItemContratoPorId(this.idContrato, this.idItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
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

  atualizeEstados(event){
    this.estadosItem = event;
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idContratoCatalogoItem: [0],
      idContratoCatalogo: [this.idContrato, Validators.required],
      idTenant: [0],
      codigo: [null],
      idProduto: [null, Validators.required],
      idUnidadeMedida: [null],
      idMarca: [null],
      valor: [null, Validators.compose([Validators.required, Validators.min(0)])],
      prazoEntrega: [0],
      moeda: [Moeda.Real, Validators.required],
      garantia: [null],
      frete: [null, Validators.required],
      loteMinimo: [null],
      observacao: [null],
      quantidadeTotal: [0],
      quantidadeSolicitada: [0],
      quantidadeDisponivel: [0],
      situacao: [SituacaoContratoCatalogoItem.Ativo],
      ncm: [null],
      icmsAliquota: [null],
      stAliquota: [null],
      difalAliquota: [null],
      ipiAliquota: [null],
      pisAliquota: [null],
      cofinsAliquota: [null],
    });

    this.form.controls.idUnidadeMedida.disable();
    this.form.controls.idMarca.disable();
    this.form.controls.loteMinimo.disable();
  }

  private preencherFormulario(item: ContratoCatalogoItem) {
    this.habilitarLoteMinimo(item.produto);
    this.form.patchValue(this.adicionarMascaras(item));
  }

  private habilitarLoteMinimo(produto: Produto) {
    if (produto && produto.unidadeMedida && produto.unidadeMedida.permiteQuantidadeFracionada) {
      this.min = 0.0001;
      this.max = 999999999.9999;
      this.permitirLoteMinimoFracionado = true;
    } else {
      this.min = 1;
      this.max = 999999999;
      this.permitirLoteMinimoFracionado = false;
    }
    this.form.controls.loteMinimo.enable();
    this.form.controls.loteMinimo.setValidators(
      Validators.compose([Validators.required, Validators.min(this.min), Validators.max(this.max)]),
    );
    this.form.controls.loteMinimo.updateValueAndValidity();
  }

  private habilitarImpostos(produto: Produto) {
    if (produto && produto.tipo === TipoProduto.Produto) {
      this.impostosHabilitados = true;
      this.form.controls.icmsAliquota.enable();
      this.form.controls.stAliquota.enable();
      this.form.controls.difalAliquota.enable();
      this.form.controls.ipiAliquota.enable();
      this.form.controls.pisAliquota.enable();
      this.form.controls.cofinsAliquota.enable();
    } else {
      this.impostosHabilitados = false;
      this.form.controls.icmsAliquota.disable();
      this.form.controls.stAliquota.disable();
      this.form.controls.difalAliquota.disable();
      this.form.controls.ipiAliquota.disable();
      this.form.controls.pisAliquota.disable();
      this.form.controls.cofinsAliquota.disable();
    }
  }

  private subscribeProduto() {
    const produto = this.form.controls.idProduto;
    this.subProduto = produto.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((idProduto) => {
        if (idProduto) { this.obterProduto(idProduto); }
      });
  }

  private removerMascaras(item: any): ContratoCatalogoItem {
    // Utiliza expressão regular para remover todos os pontos da string
    item.valor = +item.valor.replace(/\./g, '').replace(',', '.');
    item.icmsAliquota = this.removerMascara(item.icmsAliquota);
    item.stAliquota = this.removerMascara(item.stAliquota);
    item.difalAliquota = this.removerMascara(item.difalAliquota);
    item.ipiAliquota = this.removerMascara(item.ipiAliquota);
    item.pisAliquota = this.removerMascara(item.pisAliquota);
    item.cofinsAliquota = this.removerMascara(item.cofinsAliquota);

    return item;
  }

  private removerMascara(valor: string): number {
    return valor
      ? +valor.replace(/\./g, '').replace(',', '.')
      : null;
  }

  private adicionarMascaras(item: any) {
    item.valor = this.currencyPipe.transform(item.valor, undefined, '', '1.2-4', 'pt-BR').trim();
    item.icmsAliquota = this.adicionarMascaraDecimal(item.icmsAliquota);
    item.stAliquota = this.adicionarMascaraDecimal(item.stAliquota);
    item.difalAliquota = this.adicionarMascaraDecimal(item.difalAliquota);
    item.ipiAliquota = this.adicionarMascaraDecimal(item.ipiAliquota);
    item.pisAliquota = this.adicionarMascaraDecimal(item.pisAliquota);
    item.cofinsAliquota = this.adicionarMascaraDecimal(item.cofinsAliquota);

    return item;
  }

  private adicionarMascaraDecimal(valor: number): string {
    const valorComMascara = this.decimalPipe.transform(valor, '1.2-4', 'pt-BR');

    return valorComMascara ? valorComMascara.trim() : null;
  }

  private formularioValido(): boolean {
    // lote minimo
    if (this.form.controls.loteMinimo.invalid) {
      if (this.form.controls.loteMinimo.errors.min) {
        this.toastr.warning(`Menor valor permitido para lote mínimo é ${this.min}`);
      } else if (this.form.controls.loteMinimo.errors.max) {
        this.toastr.warning(`Maior valor permitido para lote mínimo é ${this.max}`);
      } else {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      }
      return false;
    }

    // valor
    if (this.form.controls.valor.invalid) {
      if (this.form.controls.valor.errors.min) {
        this.toastr.warning('O valor do item deve ser maior que 0');
      } else {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      }
      return false;
    }

    // required
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  private inserir(item: ContratoCatalogoItem) {
    this.contratoService.inserirItemCatalogo(this.idContrato, item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
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

  private alterar(item: ContratoCatalogoItem) {
    this.contratoService.alterarItemCatalogo(this.idContrato, item).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.activeModal.close(item);
      },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private async obterListas() {
    try {
      this.unidadesMedida = await this.obterUnidadesMedida();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  private async obterUnidadesMedida(): Promise<Array<UnidadeMedida>> {
    return this.unidadeMedidaService.listar().toPromise();
  }

  private obterProduto(idProduto: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.obterPorId(idProduto).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.marcas = response.marcas;
          this.form.controls.idMarca.enable();

          this.habilitarLoteMinimo(response);

          this.form.patchValue({
            idUnidadeMedida: response.idUnidadeMedida,
          });
        } else {
          this.marcas = new Array<Marca>();
          this.form.controls.idMarca.disable();
        }

        this.habilitarImpostos(response);
        this.blockUI.stop();
      },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private assineEventoDePesquisaDeNCM() {
    const ITENS_POR_PAGINA: number = 100;
    const PAGINA: number = 1;
    this.ncm$ = concat(
      this.utilitiesService.getObservable(new Array<Ncm>()),
      this.ncmInput$.pipe(
        takeUntil(this.unsubscribe),
        filter((termoDeBusca) => termoDeBusca !== null && termoDeBusca.length >= 3),
        debounceTime(750),
        distinctUntilChanged(),
        tap(() => (this.ncmLoading = true)),
        switchMap((termoDeBusca: string) => {
          this.ncmFiltro.itensPorPagina = ITENS_POR_PAGINA;
          this.ncmFiltro.pagina = PAGINA;
          this.ncmFiltro.termo = termoDeBusca;
          return this.ncmService.listarNcm(this.ncmFiltro).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => (this.ncmLoading = false)),
            map((paginacao: Paginacao<Ncm>) => paginacao ? paginacao.itens : new Array<Ncm>()),
            catchError(() => this.utilitiesService.getObservable(new Array<Ncm>())),
          );
        }),
      ),
    );
  }
}
