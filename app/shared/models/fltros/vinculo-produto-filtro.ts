import { TipoCatalogoItem } from '../enums/tipo-catalogo-item';
import { FiltroBase } from './base/filtro-base';

export class VinculoProdutoFiltro extends FiltroBase {

  descricao: string;
  idFornecedor: number;
  idProduto: number;
  tipoCatalogoItem: TipoCatalogoItem;

  constructor(init?: Partial<VinculoProdutoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
