import { FiltroBase } from './base/filtro-base';

export class ContaContabilFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<ContaContabilFiltro>) {
    super();
    Object.assign(this, init);
  }
}
