import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoParticipanteFiltro extends FiltroBase {

  idContratoCatalogo: number;
  termo: string;

  constructor(init?: Partial<ContratoCatalogoParticipanteFiltro>) {
    super();
    Object.assign(this, init);
  }
}
