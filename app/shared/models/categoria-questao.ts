export class CategoriaQuestao {
  public idCategoriaQuestao: number;
  public descricao: string;
  public notaExplicativa: string;
  public peso: number;
  public notaCategoria: number;
  public idTenant: number;

  constructor(
    idCategoriaQuestao?: number,
    descricao?: string,
    notaExplicativa?: string,
    peso?: number,
    notaCategoria?: number,
    idTenant?: number
  ) {
    this.idCategoriaQuestao = idCategoriaQuestao;
    this.descricao = descricao;
    this.notaExplicativa = notaExplicativa;
    this.peso = peso;
    this.notaCategoria = notaCategoria;
    this.idTenant = idTenant;
  }
}
