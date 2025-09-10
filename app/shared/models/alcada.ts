import { AlcadaCategoria } from './alcada-categoria';
import { AlcadaNivel } from './alcada-nivel';
import { Situacao } from './enums/situacao';
import { TipoAlcada } from './enums/tipo-alcada';

export class Alcada {

  idAlcada: number;
  idTenant: number;
  codigo: string;
  descricao: string;
  tipo: TipoAlcada;
  status: Situacao;
  alcadaCategorias: Array<AlcadaCategoria>;
  alcadaNiveis: Array<AlcadaNivel>;

  constructor(init?: Partial<Alcada>) {
    Object.assign(this, init);
  }
}
