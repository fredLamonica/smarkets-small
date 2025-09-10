export class CategoriaFornecimentoInteresse {
  public idCategoriaFornecimentoInteresse: number;
  public descricao: string;
  public idTenant: number;
  public idFornecedor: number;

  constructor(descricao: string, idTenant: number) {
    this.descricao = descricao;
    this.idTenant = idTenant;
  }
}
