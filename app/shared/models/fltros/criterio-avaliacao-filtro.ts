import { FiltroBase } from './base/filtro-base';

export class CriterioAvaliacaoFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CriterioAvaliacaoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
