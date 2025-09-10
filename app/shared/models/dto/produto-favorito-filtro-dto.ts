import { FiltroBase } from '../fltros/base/filtro-base';

export class ProdutoFavoritoFiltroDto extends FiltroBase {

  descricao: string;
  marca: string;
  fornecedor: string;

  constructor(init?: Partial<ProdutoFavoritoFiltroDto>) {
    super();
    Object.assign(this, init);
  }
}
