import { FiltroBase } from './base/filtro-base';

export class CondicaoPagamentoFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CondicaoPagamentoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
