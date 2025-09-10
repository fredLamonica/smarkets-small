import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoCondicaoPagamentoFiltro extends FiltroBase {

  idContratoCatalogo: number;

  constructor(init?: Partial<ContratoCatalogoCondicaoPagamentoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
