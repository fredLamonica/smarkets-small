import { Ordenacao } from '..';
import { FilterResult } from './filter-result';

export class GenericFilter {
  public itemOrdenar: string;
  public ordenacao: Ordenacao;
  public itensPorPagina: number;
  public pagina: number;

  public filters: FilterResult[];

  constructor(
    itemOrdenar: string,
    ordenacao: Ordenacao,
    itensPorPagina: number,
    pagina: number,
    filters: FilterResult[]
  ) {
    this.itemOrdenar = itemOrdenar;
    this.ordenacao = ordenacao;
    this.itensPorPagina = itensPorPagina;
    this.pagina = pagina;
    this.filters = filters;
  }
}
