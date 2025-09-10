import { CategoriaProduto, Situacao } from '..';

export class CategoriaFornecimentoCategoriaProduto {
  public idCategoriaFornecimentoCategoriaProduto: number;
  public idCategoriaFornecimento: number;
  public idCategoriaProduto: number;
  public categoriaProduto: CategoriaProduto;
  public situacao: Situacao;

  constructor(idCategoriaFornecimento?: number, idCategoriaProduto?: number, situacao?: Situacao) {
    this.idCategoriaFornecimento = idCategoriaFornecimento;
    this.idCategoriaProduto = idCategoriaProduto;
    this.situacao = situacao;
  }
}
