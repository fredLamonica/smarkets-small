import { FiltroBase } from './base/filtro-base';

export class AvaliacaoFornecedorFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<AvaliacaoFornecedorFiltro>) {
    super();
    Object.assign(this, init);
  }
}
