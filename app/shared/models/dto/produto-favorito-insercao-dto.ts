export class ProdutoFavoritoInsercaoDto {

  idContratoCatalogoItem?: number;
  idProduto?: number;

  constructor(init?: Partial<ProdutoFavoritoInsercaoDto>) {
    Object.assign(this, init);
  }

}
