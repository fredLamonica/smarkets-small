import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaProduto, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, Produto, SituacaoProduto } from '@shared/models';
import { CategoriaProdutoService, ProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { concat, Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { TipoCatalogo } from '../../models/enums/tipo-catalogo';
import { EnumToArrayPipe } from '../../pipes';

@Component({
  selector: 'input-produto',
  templateUrl: './input-produto.component.html',
  styleUrls: ['./input-produto.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputProdutoComponent),
      multi: true,
    },
  ],
})
export class InputProdutoComponent implements OnInit, ControlValueAccessor {

  get idProduto(): number {
    return this._idProduto;
  }

  set idProduto(value) {
    this._idProduto = value;
    this.propagateChange(this._idProduto);
  }
  @BlockUI() blockUI: NgBlockUI;

  @Input() includeCodeInSearch = false;
  @Input() produtoSelecionado: Produto;

  _idProduto: number;

  produtos$: Observable<Array<Produto>>;
  loading = false;
  input$ = new Subject<string>();
  productSearchFn;

  // #region Seleção modal
  form: FormGroup;
  settings: CustomTableSettings;
  produtos: Array<Produto>;
  categorias: Array<CategoriaProduto>;

  modalRef: any;

  selecionado: Produto;
  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idProduto';
  ordenacao: Ordenacao = Ordenacao.DESC;
  opcoesTipoCatalogo: Array<any>;
  //#endregion

  constructor(
    private produtoService: ProdutoService,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private categoriaService: CategoriaProdutoService,
  ) { }

  //#region FormControl Methods
  writeValue(obj: any): void {
    this.idProduto = obj;

    if (obj) {
      if(this.produtoSelecionado && this.produtoSelecionado != null){
          this.produtos$ = new Observable((subscriber) => {
          subscriber.next([this.produtoSelecionado]);
      });
      }else{
        this.produtos$ = this.produtoService.buscarPorDescricao('');
      }
    }
  }
  propagateChange = (_: any) => { };
  registerOnChange(fn) {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void { }
  setDisabledState?(isDisabled: boolean): void { }

  ngOnInit() {
    this.opcoesTipoCatalogo = new EnumToArrayPipe().transform(TipoCatalogo) as Array<any>;
    this.setProductSearchFn();
    this.buscarProdutosPorDescricao();
  }

  buscarProdutosPorDescricao() {
    this.produtos$ = concat(
      of([]), // default items
      this.input$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((termo) =>
          this.search(termo).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => (this.loading = false)),
          ),
        ),
      ),
    );
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.filtrarProdutos(null);
  }

  setProductSearchFn() {
    this.productSearchFn = (term: string, item: any) => {
      term = term.toLowerCase();

      if (this.includeCodeInSearch) {
        return (
          item.descricao.toLowerCase().indexOf(term) > -1 ||
          item.codigo.toLowerCase().indexOf(term) > -1
        );
      } else {
        return item.descricao.toLowerCase().indexOf(term) > -1;
      }
    };
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.filtrarProdutos(null);
  }

  selecao(produto: Produto) {
    this.selecionado = produto;
  }

  async abriModal(content) {
    this.construirForm();
    this.construirTabela();
    this.obterListas();
    this.filtrarProdutos(content);
  }

  async obterListas() {
    try {
      this.categorias = await this.obterCategorias();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  async obterCategorias(): Promise<Array<CategoriaProduto>> {
    return this.categoriaService.listarAtivas().toPromise();
  }

  buscar() {
    this.pagina = 1;
    this.filtrarProdutos();
  }

  limpar() {
    this.form.patchValue({
      descricao: '',
      codigo: '',
      idCategoria: 0,
      codigoNcm: '',
      idProduto: '',
      tipoCatalogo: TipoCatalogo['Meu Catálogo'],
    });
  }

  confirmar() {
    this.idProduto = this.selecionado.idProduto;
    this.produtos$ = new Observable((subscriber) => {
      subscriber.next([this.selecionado]);
    });
    this.modalRef.close();
  }

  private search(termo): Observable<Produto[]> {
    if (this.includeCodeInSearch) {
      return this.produtoService.searchProducts(termo);
    } else {
      return this.produtoService.buscarPorDescricao(termo);
    }
  }

  private construirForm() {
    this.form = this.formBuilder.group({
      descricao: [''],
      codigo: [''],
      idCategoria: [0],
      codigoNcm: [''],
      idProduto: [''],
      tipoCatalogo: [TipoCatalogo['Meu Catálogo']],
    });
  }

  private construirTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          '#',
          'idProduto',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'idProduto',
        ),
        new CustomTableColumn(
          'Código',
          'codigo',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'codigo',
        ),
        new CustomTableColumn(
          'Descrição',
          'descricao',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'descricao',
        ),
        new CustomTableColumn(
          'Categoria',
          'categoria.nome',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'categoria',
        ),
        new CustomTableColumn(
          'Unidade',
          'unidadeMedida.sigla',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'unidadeMedida',
        ),
        new CustomTableColumn(
          'NCM',
          'codigoNcm',
          CustomTableColumnType.text,
          null,
          null,
          null,
          'codigoNcm',
        ),
      ],
      'radio',
      this.ordenarPor,
      this.ordenacao,
    );
  }

  private filtrarProdutos(content?) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const filtro = this.form.value;

    this.produtoService
      .filtreInclusoColaborativos(
        this.registrosPorPagina,
        this.pagina,
        this.ordenarPor,
        this.ordenacao,
        filtro.idCategoria,
        filtro.descricao,
        filtro.codigo,
        SituacaoProduto.Ativo,
        filtro.codigoNcm,
        filtro.idProduto,
        filtro.tipoCatalogo,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.produtos = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.produtos = new Array<Produto>();
            this.totalPaginas = 1;
          }
          if (content) {
            this.modalRef = this.modalService.open(content, { size: 'lg', centered: true });
          }

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
  // #endregion
}
