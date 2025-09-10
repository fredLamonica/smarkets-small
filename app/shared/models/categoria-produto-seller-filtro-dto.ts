import { FiltroBase } from './fltros/base/filtro-base';

export class CategoriaProdutoSellerFiltroDto extends FiltroBase {

  idCategoriaProduto: number;
  idTenant: number;
  razaoSocial: string;
  descricaoCategoria: string;
  quantidadeItemNaoSaneado: number;

  constructor(init?: Partial<CategoriaProdutoSellerFiltroDto>) {
    super();
    Object.assign(this, init);
  }
}
