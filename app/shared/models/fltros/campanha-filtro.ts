import { FiltroBase } from './base/filtro-base';

export class CampanhaFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CampanhaFiltro>) {
    super();
    Object.assign(this, init);
  }
}
