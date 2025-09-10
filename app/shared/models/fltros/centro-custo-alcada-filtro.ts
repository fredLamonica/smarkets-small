import { FiltroBase } from './base/filtro-base';

export class CentroCustoAlcadaFiltro extends FiltroBase {

  termo: string;
  idCentroCusto: number;

  constructor(init?: Partial<CentroCustoAlcadaFiltro>) {
    super();
    Object.assign(this, init);
  }
}
