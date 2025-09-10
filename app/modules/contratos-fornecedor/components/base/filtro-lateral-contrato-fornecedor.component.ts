import { EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ListContainerConfig } from '../../../../shared/components/data-list/list-container/models/list-container-config';
import { ListChangeEvent } from '../../../../shared/components/data-list/list/models/list-change-event';
import { ListConfig } from '../../../../shared/components/data-list/list/models/list-config';
import { GrupoCategoriaProdutoDto } from '../../../../shared/models/dto/grupo-categoria-produto-dto';
import { EstrategiaFiltro } from '../../../marketplace/models/estrategia-filtro.enum';
import { TipoFiltro } from '../../../marketplace/models/tipo-filtro.enum';
import { FiltroContrato } from '../../models/filtro-contrato';
import { FiltroLateralContrato } from '../../models/filtro-lateral-contrato';

export abstract class FiltroLateralContratoFornecedorComponent extends Unsubscriber implements OnInit, OnChanges {

  @Input() filtro: FiltroContrato;
  @Input() ativo: boolean;
  @Output() filtroChange: EventEmitter<FiltroLateralContrato> = new EventEmitter<FiltroLateralContrato>();

  listContainerExpandedMaxHeight: string = '600px';

  categoriasLoading: boolean;
  categorias: Array<GrupoCategoriaProdutoDto> = new Array<GrupoCategoriaProdutoDto>();
  configListaDeCategorias: ListContainerConfig = new ListContainerConfig({
    header: 'Categoria',
    expandedMaxHeightPx: this.listContainerExpandedMaxHeight,
    listConfig: new ListConfig({
      multiSelection: false,
      bindLabel: 'nome',
      bindQuantityLabel: 'total',
      justifiedLabel: true,
      bindValue: 'idCategoriaProduto',
      emptyStateText: 'Nenhuma categoria encontrada',
      textUppercase: true,
    }),
  });

  clearFiltersMessenger: Subject<void> = new Subject<void>();
  selectItemsMessenger: Subject<Array<Number>> = new Subject<Array<Number>>();
  filtroVazio: boolean = true;

  protected abstract listContainerCollapsedItemsToDisplay: number;

  /** Como a consulta inicial de categorias retona somente as categorias PAI este flag é para indicar se este fluxo já foi executado. */
  protected somenteCategoriasPaiListadas: boolean = true;
  protected itensPorPagina: number = 9999;
  protected carregado: boolean;

  ngOnInit(): void {
    this.configListaDeCategorias.collapsedItemsToDisplay = this.listContainerCollapsedItemsToDisplay;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.filtro) {
      this.carregado = false;

      if (this.ativo) {
        this.inicializeFiltros();
        this.carregado = true;
      }
    }

    if (this.ativo && changes.ativo && !this.carregado) {
      this.inicializeFiltros();
      this.carregado = true;
    }
  }

  filtrarPorCategoria(listaDeCategoriasChangeEvent: ListChangeEvent<number>): void {
    const filtroIdsCategorias = Array.isArray(listaDeCategoriasChangeEvent.selected)
      ? (listaDeCategoriasChangeEvent.selected as Array<number>)
      : listaDeCategoriasChangeEvent.selected
        ? new Array<Number>(listaDeCategoriasChangeEvent.selected)
        : new Array<Number>();

    this.filtro.filtroLateral.idsCategorias = filtroIdsCategorias;

    this.processeFiltroVazio();

    this.filtro.filtroLateral.primeiroFiltroCategoria = this.somenteCategoriasPaiListadas && this.filtro.filtroLateral.idsCategorias
      ? true
      : !this.somenteCategoriasPaiListadas && !this.filtro.filtroLateral.idsCategorias
        ? true
        : false;

    if (this.somenteCategoriasPaiListadas && this.filtro.filtroLateral.idsCategorias) {
      this.filtro.filtroLateral.idCategoriaProdutoPai = +this.filtro.filtroLateral.idsCategorias;
    }

    if (!listaDeCategoriasChangeEvent.clearAllEvent) {
      this.filtroChange.emit(this.filtro.filtroLateral);
    }

    this.obterFiltros(TipoFiltro.categoria, listaDeCategoriasChangeEvent.clearAllEvent ? EstrategiaFiltro.proprioFiltro : EstrategiaFiltro.demaisFiltros);
  }

  sincronizarFiltroDeCategorias(listaDeCategoriasSynchronizerEvent: ListChangeEvent<number>): void {
    const filtroIdsCategorias = Array.isArray(listaDeCategoriasSynchronizerEvent.selected)
      ? (listaDeCategoriasSynchronizerEvent.selected as Array<number>)
      : listaDeCategoriasSynchronizerEvent.selected
        ? new Array<Number>(listaDeCategoriasSynchronizerEvent.selected)
        : new Array<Number>();

    this.filtro.filtroLateral.idsCategorias = filtroIdsCategorias;
  }

  limparTodosFiltros() {
    this.filtro = Object.assign(this.filtro, { filtroLateral: new FiltroLateralContrato() });
    this.ajusteConfiguracoesDeCategoria(true);
    this.filtroChange.emit(this.filtro.filtroLateral);
    setTimeout(() => this.clearFiltersMessenger.next(), 10);
  }

  protected abstract processeFiltroVazio(): void;
  protected abstract inicializeFiltros(): void;
  protected abstract obterFiltros(tipoFiltro: TipoFiltro, estrategia: EstrategiaFiltro): void;

  protected ajusteConfiguracoesDeCategoria(somenteCategoriasPaiListadas: boolean): void {
    this.somenteCategoriasPaiListadas = somenteCategoriasPaiListadas;

    if (somenteCategoriasPaiListadas) {
      this.configListaDeCategorias.listConfig = {
        ...this.configListaDeCategorias.listConfig,
        multiSelection: false,
        noneSelectedIsAllSelected: false,
        parentKey: null,
        parentValue: null,
      };
    } else {
      this.configListaDeCategorias.listConfig = {
        ...this.configListaDeCategorias.listConfig,
        multiSelection: true,
        noneSelectedIsAllSelected: true,
        parentKey: 'idCategoriaProduto',
        parentValue: 'idCategoriaProdutoPai',
      };
    }
  }
}
