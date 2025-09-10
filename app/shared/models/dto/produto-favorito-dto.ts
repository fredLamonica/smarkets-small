export class ProdutoFavoritoDto {

  idProdutoFavorito: number;
  idContratoCatalogoItem: number;
  idProduto: number;
  idUsuario: number;
  idTenant: number;
  produto: string;
  marca: string;
  fornecedor: string;
  frete: string;
  valorUnitario: number;

  constructor(init?: Partial<ProdutoFavoritoDto>) {
    Object.assign(this, init);
  }
}
