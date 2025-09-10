import { FiltroBase } from './base/filtro-base';

export class CartaResponsabilidadeFornecedorFiltro extends FiltroBase {

  idFornecedor: number;

  constructor(init?: Partial<CartaResponsabilidadeFornecedorFiltro>) {
    super();
    Object.assign(this, init);
  }
}
