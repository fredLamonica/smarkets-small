export class CotacaoFiltro {
  public idCotacao: string;
  public termoDescricaoCotacao: string;
  public termoCompradorResponsavel: string;
  public termoStatus: string;

  constructor(
    idCotacao: string,
    termoDescricaoCotacao: string,
    termoCompradorResponsavel: string,
    termoStatus: string
  ) {
    this.idCotacao = idCotacao;
    this.termoDescricaoCotacao = termoDescricaoCotacao;
    this.termoCompradorResponsavel = termoCompradorResponsavel;
    this.termoStatus = termoStatus;
  }
}
