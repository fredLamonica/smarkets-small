export class DashboardFiltro {
  public centros: Array<string>;
  public idsClassificacoesSlas: Array<number>;
  public dataInicio: Date;
  public dataFim: Date;

  constructor(
    centros: Array<string>,
    idsClassificacoesSlas: Array<number>,
    dataInicio: Date,
    dataFim: Date
  ) {
    this.centros = centros;
    this.idsClassificacoesSlas = idsClassificacoesSlas;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
  }
}
