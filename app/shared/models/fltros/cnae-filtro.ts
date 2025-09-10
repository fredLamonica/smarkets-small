import { FiltroBase } from './base/filtro-base';

export class CnaeFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CnaeFiltro>) {
    super();
    Object.assign(this, init);
  }
}
