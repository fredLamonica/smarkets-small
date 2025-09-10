export class BotaoCustomTable {
  public title: string;
  public icone: string;
  public iconeCondicional: string;
  public colunaValidacao: string;
  public valorComparacao: string;

  constructor(
    title?: string,
    icone?: string,
    iconeCondicional?: string,
    colunaValidacao?: string,
    valorComparacao?: string
  ) {
    this.title = title;
    this.icone = icone;
    this.iconeCondicional = iconeCondicional;
    this.colunaValidacao = colunaValidacao;
    this.valorComparacao = valorComparacao;
  }
}
