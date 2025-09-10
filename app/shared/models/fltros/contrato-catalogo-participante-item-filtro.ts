import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoParticipanteItemFiltro extends FiltroBase {

  idContratoCatalogoParticipante: number;
  idContratoCatalogo: number;
  termo: string;

  constructor(init?: Partial<ContratoCatalogoParticipanteItemFiltro>) {
    super();
    Object.assign(this, init);
  }
}
