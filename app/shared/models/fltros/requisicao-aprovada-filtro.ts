export class RequisicaoAprovadaFiltro {
  constructor(
    public idCategoriaProduto: number | undefined | null,
    public categoriaDemanda: number | undefined | null,
    public idClassificacaoSla: number | undefined | null,
    public codigoFilialEmpresa: string | undefined | null,
    public marca: string | undefined | null,
    public codigoSolicitacaoCompra: string | undefined | null,
    public valorMin: number | undefined | null,
    public valorMax: number | undefined | null
  ) {}

  private hasValue(attribute: any): boolean {
    return attribute != null || attribute != undefined;
  }

  public compareFilter(value: any | null, objectFilter: any | null) {
    return (
      !value ||
      (value && objectFilter && this.normalizeString(objectFilter) == this.normalizeString(value))
    );
  }

  public compareMin(value: number | null, objectFilter: number | null) {
    return !value || (value && objectFilter && objectFilter >= value);
  }

  public compareMax(value: number | null, objectFilter: number | null) {
    return !value || (value && (objectFilter || objectFilter == 0) && objectFilter <= value);
  }

  private normalizeString(value: any) {
    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  }

  public filtroPreenchido(): boolean {
    return (
      this.hasValue(this.idCategoriaProduto) ||
      this.hasValue(this.categoriaDemanda) ||
      this.hasValue(this.idClassificacaoSla) ||
      this.hasValue(this.codigoFilialEmpresa) ||
      this.hasValue(this.marca) ||
      this.hasValue(this.codigoSolicitacaoCompra) ||
      this.hasValue(this.valorMin) ||
      this.hasValue(this.valorMax)
    );
  }
}
