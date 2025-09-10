import { FiltroBase } from './base/filtro-base';

export class NcmFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<NcmFiltro>) {
    super();
    Object.assign(this, init);
  }
}
