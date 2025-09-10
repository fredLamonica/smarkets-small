import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoEstadoFiltro extends FiltroBase {

  idContratoCatalogo: number;
  idContratoCatalogoItem: number;
  termo: string;

  constructor(init?: Partial<ContratoCatalogoEstadoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
