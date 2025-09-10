import { Ordenacao } from '../enums/ordenacao';

export class FilterBase {
  public itemOrdenar: string;
  public ordenacao: Ordenacao;
  public itensPorPagina: number;
  public pagina: number;
  public totalPaginas: number;
}
