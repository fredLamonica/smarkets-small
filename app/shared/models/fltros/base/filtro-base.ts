import { Ordenacao } from '../../enums/ordenacao';

export abstract class FiltroBase {

  itemOrdenar: string;
  ordenacao: Ordenacao;
  itensPorPagina: number;
  pagina: number;
  totalPaginas: number;

}
