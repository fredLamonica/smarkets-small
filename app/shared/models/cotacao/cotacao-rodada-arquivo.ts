export class CotacaoRodadaArquivo {
  public idCotacaoRodadaArquivo: number;
  public idCotacaoRodada: number;
  public idArquivo: number;
  public idTenant: number;

  constructor(idCotacaoRodada: number, idArquivo: number, idTenant: number) {
    this.idCotacaoRodada = idCotacaoRodada;
    this.idArquivo = idArquivo;
    this.idTenant = idTenant;
  }
}
