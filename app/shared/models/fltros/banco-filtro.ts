import { FiltroBase } from './base/filtro-base';

export class BancoFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<BancoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
