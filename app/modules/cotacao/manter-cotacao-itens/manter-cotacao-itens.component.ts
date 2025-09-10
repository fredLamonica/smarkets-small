import { CurrencyPipe } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Arquivo, CategoriaProduto, CentroCusto, CondicaoPagamento, Cotacao, CotacaoItem, ItemSolicitacaoCompra, Marca, PessoaJuridica, RequisicaoItem, SituacaoCotacao, SituacaoCotacaoItem, SlaItem } from '@shared/models';
import { RequisicaoAprovadaFiltro } from '@shared/models/fltros/requisicao-aprovada-filtro';
import { AutenticacaoService, CategoriaProdutoService, CentroCustoService, CondicaoPagamentoService, PessoaJuridicaService, SlaService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, takeUntil, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { RequisicaoService } from '../../../shared/providers/requisicao.service';
import { ClassificacaoSLA } from './../../../shared/models/enums/classificacao-sla';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-cotacao-itens',
  templateUrl: './manter-cotacao-itens.component.html',
  styleUrls: ['./manter-cotacao-itens.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ManterCotacaoItensComponent),
      multi: true,
    },
  ],
})
export class ManterCotacaoItensComponent extends Unsubscriber implements OnInit, ControlValueAccessor {

  get itens(): Array<CotacaoItem> {
    return this._itens;
  }

  set itens(itens: Array<CotacaoItem>) {
    this._itens = itens;
    this.propagateChange(this._itens);
  }
  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-cotacao') idCotacao: number;
  // tslint:disable-next-line: no-input-rename
  @Input('cotacao') cotacao: Cotacao;
  // tslint:disable-next-line: no-input-rename
  @Input('cotacao-itens') cotacaoItens: Array<CotacaoItem>;
  @Input() readonly: boolean = false;

  SituacaoCotacaoItem = SituacaoCotacaoItem;
  situacaoCotacao = SituacaoCotacao;

  itensDisponiveis: Array<CotacaoItem> = new Array<CotacaoItem>();
  itensDisponiveisSelecionados: Array<CotacaoItem> = new Array<CotacaoItem>();
  itensDisponiveisBusca: Array<CotacaoItem>;

  itensIncluidosSelecionados: Array<CotacaoItem> = new Array<CotacaoItem>();
  itensIncluidosBusca: Array<CotacaoItem>;

  formBuscaAvancada: FormGroup;
  centrosCusto$: Observable<Array<CentroCusto>>;
  centrosCustoLoading: boolean;

  categorias$: Observable<Array<CategoriaProduto>>;
  categoriasLoading: boolean;

  classificacaoSlas$: Observable<Array<ClassificacaoSLA>>;
  classificacaoLoading: boolean;

  condicoesPagamento$: Observable<Array<CondicaoPagamento>>;
  condicoesPagamentoLoading: boolean;

  filiais$: Observable<Array<PessoaJuridica>>;
  filiaisLoading: boolean;

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

  numeroPropostasRecebidas: number;
  termo: string = '';

  todosItensIncluidosSelecionados: boolean = false;

  todosItensDisponiveisSelecionados: boolean = false;

  private _itens: Array<CotacaoItem>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private requisicaoService: RequisicaoService,
    private authService: AutenticacaoService,
    private fb: FormBuilder,
    private centroCustoService: CentroCustoService,
    private categoriaProdutoService: CategoriaProdutoService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private slaService: SlaService,
    private currencyPipe: CurrencyPipe,
    private pessoaJuridicaService: PessoaJuridicaService,

  ) {
    super();
  }

  ngOnInit() {
    if (this.cotacaoItens) { this.preencherCotacaoItens(null, this.cotacaoItens); } else { this.obterRequisicaoItens(); }

    this.contruirFormularioBuscaAvancada();

  }

  contruirFormularioBuscaAvancada() {
    this.formBuscaAvancada = this.fb.group({
      idCategoriaProduto: [null],
      idCentroCusto: [null],
      idClassificacaoSla: [null],
      idCondicaoPagamento: [null],
      marca: [null],
      valorRequisicaoMin: [
        null,
        Validators.compose([Validators.min(0), Validators.max(999999999.9999)]),
      ],
      valorRequisicaoMax: [
        null,
        Validators.compose([Validators.min(0), Validators.max(999999999.9999)]),
      ],
      categoriaDemanda: [null],
      codigoFilialEmpresa: [null],
      codigoSolicitacaoCompra: [null],
    });
  }

  // #region ControlValue Methods
  writeValue(obj: any): void {
    this.itens = obj;
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }

  subFiliais() {
    if (!this.filiais$) {
      this.filiaisLoading = true;
      this.filiais$ = this.pessoaJuridicaService.ObterFiliais().pipe(
        catchError(() => of([])),
        tap((filiais) => {
          this.filiaisLoading = false;
        }),
        shareReplay(),
      );
    }
  }

  subCategorias() {
    if (!this.categorias$) {
      this.categoriasLoading = true;
      this.categorias$ = this.categoriaProdutoService.listarAtivas().pipe(
        catchError(() => of([])),
        tap(() => (this.categoriasLoading = false)),
        shareReplay(),
      );
    }
  }

  subClassificacaoSlas() {
    if (!this.classificacaoSlas$) {
      this.classificacaoLoading = true;
      this.classificacaoSlas$ = this.slaService.listarClassificacoes().pipe(
        catchError(() => of([])),
        tap(() => (this.classificacaoLoading = false)),
        shareReplay(),
      );
    }
  }

  // #region Buscas
  buscarItensIncluidos() {
    let numeroPropostasRecebidas = null;

    if (this.numeroPropostasRecebidas || this.numeroPropostasRecebidas != null) {
      numeroPropostasRecebidas = Number(this.numeroPropostasRecebidas);
    }

    const termo = this.termo ? this.termo.toLowerCase().trim() : '';
    this.itensIncluidosSelecionados = new Array<CotacaoItem>();
    this.todosItensIncluidosSelecionados = false;
    if (termo !== '' && numeroPropostasRecebidas === null) {
      // Busca pelo termo
      this.itensIncluidosBusca = this.itens.filter(
        (item) =>
          item.idRequisicaoItem.toString() === termo ||
          item.produto.descricao.toLowerCase().includes(termo) ||
          (item.requisicaoItem &&
            item.requisicaoItem.codigoSolicitacaoCompra &&
            item.requisicaoItem.codigoSolicitacaoCompra.toLocaleLowerCase().includes(termo)) ||
          (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.codigo.toLocaleString().includes(termo)) ||
          (item.produto.categoria && item.produto.categoria.nome.toLowerCase().includes(termo)) ||
          (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.tipoDocumento &&
            item.requisicaoItem.itemSolicitacaoCompra.tipoDocumento.toLowerCase().includes(termo)),
      );
    } else if (termo !== '' && numeroPropostasRecebidas !== null) {
      // Busca pelo termo e Quantidade
      this.buscarItensComQuantidade(termo, numeroPropostasRecebidas);
    } else if (termo === '' && numeroPropostasRecebidas !== null) {
      // Busca pela Quantidade
      this.itensIncluidosBusca = this.itens.filter(
        (item) => item.numeroPropostasRecebidas === numeroPropostasRecebidas,
      );
    } else { this.limparFiltroItensIncluidos(); }
  }

  limparFiltroItensIncluidos() {
    this.itensIncluidosBusca = null;
  }

  exibirItemIncluido(cotacaoItem: CotacaoItem): boolean {
    return (
      !this.itensIncluidosBusca ||
      this.itensIncluidosBusca.findIndex(
        (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
      ) !== -1
    );
  }

  buscarItensDisponiveis(termo) {
    termo = termo.toLowerCase().trim();
    this.itensDisponiveisSelecionados = new Array<CotacaoItem>();
    this.todosItensDisponiveisSelecionados = false;
    if (termo !== '') {
      this.itensDisponiveisBusca = this.itensDisponiveis.filter(
        (item) =>
          item.idRequisicaoItem.toString() === termo ||
          item.produto.descricao.toLowerCase().includes(termo) ||
          (item.requisicaoItem &&
            item.requisicaoItem.codigoSolicitacaoCompra &&
            item.requisicaoItem.codigoSolicitacaoCompra.toLocaleLowerCase().includes(termo)) ||
          (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.codigo.toLocaleString().includes(termo)) ||
          (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.tipoDocumento &&
            item.requisicaoItem.itemSolicitacaoCompra.tipoDocumento.toLowerCase().includes(termo)) ||
            (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.nomeResponsavel &&
            item.requisicaoItem.itemSolicitacaoCompra.nomeResponsavel.toLowerCase().includes(termo))
      );

    } else { this.limparFiltroItensDisponiveis(); }
  }

  buscarItensIncluidosParaSalvar(termo) {
    let numeroPropostasRecebidas = null;

    if (this.numeroPropostasRecebidas || this.numeroPropostasRecebidas !== null) {
      numeroPropostasRecebidas = Number(this.numeroPropostasRecebidas);
    }

    // tslint:disable-next-line: no-unused-expression
    this.termo ? this.termo.toLowerCase().trim() : '';
    this.itensIncluidosSelecionados = new Array<CotacaoItem>();
    this.todosItensIncluidosSelecionados = false;
    if (termo !== '' && numeroPropostasRecebidas === null) {
      // Busca pelo termo
      this.itensIncluidosBusca = this.itens.filter(
        (item) =>
          item.idRequisicaoItem.toString() === termo ||
          item.produto.descricao.toLowerCase().includes(termo) ||
          (item.requisicaoItem &&
            item.requisicaoItem.codigoSolicitacaoCompra &&
            item.requisicaoItem.codigoSolicitacaoCompra.toLocaleLowerCase().includes(termo)) ||
          (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.codigo.toLocaleString().includes(termo)) ||
          (item.produto.categoria && item.produto.categoria.nome.toLowerCase().includes(termo)) ||
          (item.requisicaoItem &&
            item.requisicaoItem.itemSolicitacaoCompra &&
            item.requisicaoItem.itemSolicitacaoCompra.tipoDocumento &&
            item.requisicaoItem.itemSolicitacaoCompra.tipoDocumento.toLowerCase().includes(termo)),
      );
    } else if (termo !== '' && numeroPropostasRecebidas != null) {
      // Busca pelo termo e Quantidade
      this.buscarItensComQuantidade(termo, numeroPropostasRecebidas);
    } else if (termo === '' && numeroPropostasRecebidas != null) {
      // Busca pela Quantidade
      this.itensIncluidosBusca = this.itens.filter(
        (item) => item.numeroPropostasRecebidas === numeroPropostasRecebidas,
      );
    } else { this.limparFiltroItensIncluidos(); }
  }

  buscarFiltroAvancado() {
    const valorRequisicaoMin =
      this.formBuscaAvancada.value.valorRequisicaoMin === ''
        ? null
        : this.formBuscaAvancada.value.valorRequisicaoMin != null
          ? parseFloat(
            this.formBuscaAvancada.value.valorRequisicaoMin.replace('.', '').replace(',', '.'),
          )
          : null;

    const valorRequisicaoMax =
      this.formBuscaAvancada.value.valorRequisicaoMax === ''
        ? null
        : this.formBuscaAvancada.value.valorRequisicaoMax != null
          ? parseFloat(
            this.formBuscaAvancada.value.valorRequisicaoMax.replace('.', '').replace(',', '.'),
          )
          : null;

    const requisicaoAprovadaFiltro: RequisicaoAprovadaFiltro = new RequisicaoAprovadaFiltro(
      this.formBuscaAvancada.value.idCategoriaProduto,
      this.formBuscaAvancada.value.categoriaDemanda,
      this.formBuscaAvancada.value.idClassificacaoSla,
      this.formBuscaAvancada.value.codigoFilialEmpresa,
      this.formBuscaAvancada.value.marca,
      this.formBuscaAvancada.value.codigoSolicitacaoCompra,
      valorRequisicaoMin,
      valorRequisicaoMax,
    );

    if (valorRequisicaoMax != null && valorRequisicaoMin > valorRequisicaoMax) {
      return this.toastr.warning(
        'O valor Requisição (Min) não pode ser MAIOR que o valor Requisição (Máx)',
      );
    }

    this.itensIncluidosSelecionados = new Array<CotacaoItem>();
    this.todosItensIncluidosSelecionados = false;

    if (requisicaoAprovadaFiltro.filtroPreenchido()) {
      this.itensDisponiveisBusca = this.itensDisponiveis.filter((item) => {
        return (
          requisicaoAprovadaFiltro.compareFilter(
            requisicaoAprovadaFiltro.idCategoriaProduto,
            this.getValue(item.produto.categoria, 'idCategoriaProduto'),
          ) &&
          requisicaoAprovadaFiltro.compareFilter(
            requisicaoAprovadaFiltro.categoriaDemanda,
            this.getValue(item.requisicaoItem.itemSolicitacaoCompra, 'categoriaDemanda'),
          ) &&
          requisicaoAprovadaFiltro.compareFilter(
            requisicaoAprovadaFiltro.idClassificacaoSla,
            this.getValue(item.requisicaoItem.slaItem, 'idClassificacao'),
          ) &&
          requisicaoAprovadaFiltro.compareFilter(
            requisicaoAprovadaFiltro.codigoFilialEmpresa,
            this.getValue(item.requisicaoItem.itemSolicitacaoCompra, 'codigoFilialEmpresa'),
          ) &&
          requisicaoAprovadaFiltro.compareFilter(
            requisicaoAprovadaFiltro.marca,
            this.getValue(item.marca, 'nome'),
          ) &&
          (requisicaoAprovadaFiltro.compareFilter(
            requisicaoAprovadaFiltro.codigoSolicitacaoCompra,
            this.getValue(item.requisicaoItem.itemSolicitacaoCompra, 'codigoSolicitacaoCompra'),
          )
            ||
            requisicaoAprovadaFiltro.compareFilter(
              requisicaoAprovadaFiltro.codigoSolicitacaoCompra,
              this.getValue(item.requisicaoItem, 'idIntegracaoRequisicaoERP'),
            )
          ) &&
          requisicaoAprovadaFiltro.compareMin(
            requisicaoAprovadaFiltro.valorMin,
            item.requisicaoItem.valorReferencia * item.requisicaoItem.quantidade,
          ) &&
          requisicaoAprovadaFiltro.compareMax(
            requisicaoAprovadaFiltro.valorMax,
            item.requisicaoItem.valorReferencia * item.requisicaoItem.quantidade,
          )
        );
      });
    } else { this.limparFiltroItensDisponiveis(); }
  }

  limparFiltroItensDisponiveis() {
    this.itensDisponiveisBusca = null;
  }

  exibirItemDisponivel(cotacaoItem: CotacaoItem): boolean {
    return (
      !this.itensDisponiveisBusca ||
      this.itensDisponiveisBusca.findIndex(
        (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
      ) !== -1
    );
  }
  // #endregion

  remover() {
    this.itensIncluidosSelecionados.forEach((cotacaoItem) => {
      this.itensDisponiveis = this.itensDisponiveis.concat(
        this.itens.splice(
          this.itens.findIndex((item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem),
          1,
        ),
      );
    });

    if (!this.todosItensIncluidosSelecionados) {
      this.removerSubItensPacote(this.itensIncluidosSelecionados);
    }
    this.itensIncluidosSelecionados = new Array<CotacaoItem>();
    this.todosItensIncluidosSelecionados = false;

    this.itensDisponiveis = this.itensDisponiveis.sort((a, b) =>
      a.idRequisicaoItem < b.idRequisicaoItem ? 1 : -1,
    );
  }

  selecionarItemIncluido(cotacaoItem: CotacaoItem) {
    if (this.itemIncluidoSelecionado(cotacaoItem)) {
      this.itensIncluidosSelecionados.splice(
        this.itensIncluidosSelecionados.findIndex(
          (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
        ),
        1,
      );
      this.todosItensIncluidosSelecionados = false;
    } else { this.itensIncluidosSelecionados.push(cotacaoItem); }
  }

  itemIncluidoSelecionado(cotacaoItem: CotacaoItem): boolean {
    return (
      this.itensIncluidosSelecionados.findIndex(
        (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
      ) !== -1
    );
  }

  selecionarTodosIncluidos() {
    if (this.todosItensIncluidosSelecionados) {
      this.todosItensIncluidosSelecionados = false;
      this.itensIncluidosSelecionados = new Array<CotacaoItem>();
    } else {
      this.todosItensIncluidosSelecionados = true;
      this.itens.forEach((item) => {
        if (this.exibirItemIncluido(item) && !this.itemIncluidoSelecionado(item)) {
          this.itensIncluidosSelecionados.push(item);
        }
      });
    }
  }

  adicionar() {
    this.itensIncluidosSelecionados.forEach((cotacaoItem) => {
      this.itensDisponiveis = this.itensDisponiveis.concat(
        this.itens.splice(
          this.itens.findIndex((item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem),
          1,
        ),
      );
    });
    this.itensDisponiveisSelecionados.forEach((cotacaoItem) => {
      this.itens = this.itens.concat(
        this.itensDisponiveis.splice(
          this.itensDisponiveis.findIndex(
            (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
          ),
          1,
        ),
      );
    });

    if (!this.todosItensDisponiveisSelecionados) {
      this.adicionarSubItensPacote(this.itensDisponiveisSelecionados);
    }
    this.itensDisponiveisSelecionados = new Array<CotacaoItem>();
    this.todosItensDisponiveisSelecionados = false;

    this.itens = this.itens.sort((a, b) => (a.idRequisicaoItem < b.idRequisicaoItem ? 1 : -1));
  }

  selecionarItemDisponivel(cotacaoItem: CotacaoItem) {
    if (this.itemDisponivelSelecionado(cotacaoItem)) {
      this.itensDisponiveisSelecionados.splice(
        this.itensDisponiveisSelecionados.findIndex(
          (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
        ),
        1,
      );
      this.todosItensDisponiveisSelecionados = false;
    } else { this.itensDisponiveisSelecionados.push(cotacaoItem); }
  }

  itemDisponivelSelecionado(cotacaoItem: CotacaoItem): boolean {
    return (
      this.itensDisponiveisSelecionados.findIndex(
        (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
      ) !== -1
    );
  }

  selecionarTodosDisponiveis() {
    if (this.todosItensDisponiveisSelecionados) {
      this.todosItensDisponiveisSelecionados = false;
      this.itensDisponiveisSelecionados = new Array<CotacaoItem>();
    } else {
      this.todosItensDisponiveisSelecionados = true;
      this.itensDisponiveis.forEach((item) => {
        if (this.exibirItemDisponivel(item) && !this.itemDisponivelSelecionado(item)) {
          this.itensDisponiveisSelecionados.push(item);
        }
      });
    }
  }

  // #region Pacotes de SubItens Solicitacao Compra

  adicionarSubItensPacote(itensAdicionados: Array<CotacaoItem>) {
    let itensDisponiveisPacote;
    const itensAdicionadosComSubItem = itensAdicionados.filter(
      (itemAdicionado) => itemAdicionado.requisicaoItem.idSubItemSolicitacaoCompra != null,
    );
    if (itensAdicionadosComSubItem && itensAdicionadosComSubItem.length) {
      itensAdicionadosComSubItem.forEach((element) => {
        itensDisponiveisPacote = this.itensDisponiveis.filter(
          (itemDisponivel) =>
            itemDisponivel.requisicaoItem.idItemSolicitacaoCompra ===
            element.requisicaoItem.idItemSolicitacaoCompra,
        );
        if (itensDisponiveisPacote && itensDisponiveisPacote.length) {
          this.adicionarItens(itensDisponiveisPacote);
          const itensIncluidos = itensDisponiveisPacote
            .map((item) => {
              return `${item.requisicaoItem.idRequisicaoItem} - ${item.produto.descricao}`;
            })
            .join(';</br>');

          this.toastr.warning(
            `<p>Foram incluidos os seguintes itens: </br>
            ${itensIncluidos} </br></br>
            Pois o item adicionado ${element.idRequisicaoItem} - ${element.produto.descricao} faz parte de um pacote de itens,
            e todos eles deverão ser finalizados no mesmo pedido`,
            null,
            { enableHtml: true },
          );
        }
        itensDisponiveisPacote = null;
      });
    }
  }

  adicionarItens(itens: Array<CotacaoItem>) {
    itens.forEach((cotacaoItem) => {
      this.itens = this.itens.concat(
        this.itensDisponiveis.splice(
          this.itensDisponiveis.findIndex(
            (item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem,
          ),
          1,
        ),
      );
    });
  }

  removerSubItensPacote(itensRemovidos: Array<CotacaoItem>) {
    let itensParticipantesPacote;
    const itensRemovidosComSubItem = itensRemovidos.filter(
      (itemRemovido) => itemRemovido.requisicaoItem.idSubItemSolicitacaoCompra != null,
    );
    if (itensRemovidosComSubItem && itensRemovidosComSubItem.length) {
      itensRemovidosComSubItem.forEach((element) => {
        itensParticipantesPacote = this.itens.filter(
          (itemParticipante) =>
            itemParticipante.requisicaoItem.idItemSolicitacaoCompra ===
            element.requisicaoItem.idItemSolicitacaoCompra,
        );
        if (itensParticipantesPacote && itensParticipantesPacote.length) {
          this.removerItens(itensParticipantesPacote);
          // tslint:disable-next-line: no-shadowed-variable
          const itensRemovidos = itensParticipantesPacote
            .map((item) => {
              return ` -${item.requisicaoItem.idRequisicaoItem} - ${item.produto.descricao}`;
            })
            .join(';</br>');

          this.toastr.warning(
            `<p>Foram removidos os seguintes itens: </br>
            ${itensRemovidos} </br></br>
            Pois o item removido ${element.idRequisicaoItem} - ${element.produto.descricao} faz parte de um pacote de itens,
            e todos eles deverão ser finalizados no mesmo pedido</p>`,
            null,
            { enableHtml: true },
          );
        }
        itensParticipantesPacote = null;
      });
    }
  }

  removerItens(itens: Array<CotacaoItem>) {
    itens.forEach((cotacaoItem) => {
      this.itensDisponiveis = this.itensDisponiveis.concat(
        this.itens.splice(
          this.itens.findIndex((item) => item.idRequisicaoItem === cotacaoItem.idRequisicaoItem),
          1,
        ),
      );
    });
  }
  // #endregion

  private obterRequisicaoItens() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.requisicaoService.obterItensAprovados().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) { this.preencherCotacaoItens(response); }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  // Region Sub Listas
  private subListas() {
    this.subCentrosCusto();
    this.subCategorias();
    this.subClassificacaoSlas();
    this.subCondicaoPagamento();
    this.subFiliais();
  }

  private subCentrosCusto() {
    this.centrosCustoLoading = true;
    this.centrosCusto$ = this.centroCustoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap(() => (this.centrosCustoLoading = false)),
      shareReplay(),
    );
  }

  private subCondicaoPagamento() {
    this.condicoesPagamento$ = this.condicaoPagamentoService.listarAtivos().pipe(
      catchError(() => of([])),
      tap(() => (this.condicoesPagamentoLoading = false)),
      shareReplay(),
    );
  }
  // End Sub Listas

  private preencherCotacaoItens(
    requisicaoItens: Array<RequisicaoItem>,
    cotacaoItens: Array<CotacaoItem> = null,
  ) {
    const idCotacao = this.idCotacao ? this.idCotacao : 0;
    let itens;
    if (cotacaoItens == null) {
      itens = requisicaoItens.map((item) => {
        return new CotacaoItem(
          0,
          null,
          idCotacao,
          0,
          SituacaoCotacaoItem.Ativo,
          null,
          moment().format(),
          item.idRequisicaoItem,
          item,
          item.idProduto,
          item.produto,
          item.idCondicaoPagamento,
          item.condicaoPagamento,
          item.valorReferencia,
          item.moeda,
          item.quantidadeRestante,
          item.idMarca,
          item.marca,
          item.idEnderecoEntrega,
          item.idEnderecoCobranca,
          item.idEnderecoFaturamento,
          item.dataEntrega,
          '',
          '',
          item.idTipoRequisicao,
          item.tipoRequisicao,
          new Array<Arquivo>(),
        );
      });
    } else {
      itens = cotacaoItens;
      this.itens = this.itensDisponiveis;
    }

    if (!this.idCotacao && !this.itens.length) {
      this.itensDisponiveis = itens;
    } else {
      this.itensDisponiveis = itens.filter(
        (item) =>
          !this.itens
            .map((i) => {
              return i.idRequisicaoItem;
            })
            .includes(item.idRequisicaoItem),
      );
    }
  }

  private buscarItensComQuantidade(termo: string, numeroPropostasRecebidas: number) {
    this.itensIncluidosBusca = this.itens.filter(
      (item) =>
        (item.idRequisicaoItem.toString() === termo &&
          item.numeroPropostasRecebidas === numeroPropostasRecebidas) ||
        (item.produto.descricao.toLowerCase().includes(termo) &&
          item.numeroPropostasRecebidas === numeroPropostasRecebidas) ||
        (item.requisicaoItem &&
          item.requisicaoItem.codigoSolicitacaoCompra &&
          item.requisicaoItem.codigoSolicitacaoCompra.toLocaleLowerCase().includes(termo) &&
          item.numeroPropostasRecebidas === numeroPropostasRecebidas) ||
        (item.requisicaoItem &&
          item.requisicaoItem.itemSolicitacaoCompra &&
          item.requisicaoItem.itemSolicitacaoCompra.codigo.toLocaleString().includes(termo) &&
          item.numeroPropostasRecebidas === numeroPropostasRecebidas) ||
        (item.produto.categoria &&
          item.produto.categoria.nome.toLowerCase().includes(termo) &&
          item.numeroPropostasRecebidas === numeroPropostasRecebidas),
    );
  }

  private getValue(
    item: ItemSolicitacaoCompra | Marca | CategoriaProduto | SlaItem | RequisicaoItem | null,
    property: string,
  ) {
    return item ? item[property] : null;
  }

  private adicionarMascaraValor(valor: number) {
    const valorComMascara: string = this.currencyPipe
      .transform(valor, undefined, '', '1.2-4', 'pt-BR')
      .trim();
    return valorComMascara;
  }

  //#endregion
}
