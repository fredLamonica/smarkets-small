export class IconeCustomTable {
  public title: string;
  public icone: string;
  public textoTooltip: string;
  public tooltipClass: string;

  constructor(
    title?: string,
    icone?: string,
    textoTooltip?: string,
    tooltipClass?: string
  ) {
    this.title = title;
    this.icone = icone;
    this.textoTooltip = textoTooltip;
    this.tooltipClass = tooltipClass;
  }
}
