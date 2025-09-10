import { FiltroBase } from './base/filtro-base';

export class CentroCustoFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CentroCustoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
