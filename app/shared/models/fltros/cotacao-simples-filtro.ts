import { FiltroBase } from './base/filtro-base';

export class CotacaoSimplesFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CotacaoSimplesFiltro>) {
    super();
    Object.assign(this, init);
  }
}
