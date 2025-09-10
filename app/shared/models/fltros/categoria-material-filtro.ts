import { FiltroBase } from './base/filtro-base';

export class CategoriaMaterialFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CategoriaMaterialFiltro>) {
    super();
    Object.assign(this, init);
  }
}
