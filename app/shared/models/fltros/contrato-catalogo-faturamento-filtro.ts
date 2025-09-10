import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoFaturamentoFiltro extends FiltroBase {

  idContratoCatalogo: number;
  termo: string;

  constructor(init?: Partial<ContratoCatalogoFaturamentoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
