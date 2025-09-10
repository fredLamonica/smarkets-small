import { FiltroBase } from './base/filtro-base';

export class CategoriaProdutoFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<CategoriaProdutoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
