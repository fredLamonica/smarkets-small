import { FiltroBase } from './base/filtro-base';

export class CategoriaFornecimentoFiltro extends FiltroBase {

  termo: string;
  idCategoriaFornecimento: number;

  constructor(init?: Partial<CategoriaFornecimentoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
