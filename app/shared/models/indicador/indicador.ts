export class Indicador {
  public codigo: string;
  public label: Array<string>;
  public dataSets: Array<IndicadorDataSet>;
  public colors: Array<string>;
}

export class IndicadorDataSet {
  public data: Array<number>;
  public label: string;
}
