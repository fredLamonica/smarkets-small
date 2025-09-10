export class FiltroLateralContrato {
  idsEstados: Array<Number> = new Array<Number>();
  idsMarcas: Array<Number> = new Array<Number>();
  idsFornecedores: Array<Number> = new Array<Number>();
  idsCategorias: Array<Number> = new Array<Number>();
  idsClientes: Array<Number> = new Array<Number>();
  idCategoriaProdutoPai: number;
  primeiroFiltroCategoria: boolean;

  constructor(init?: Partial<FiltroLateralContrato>) {
    Object.assign(this, init);
  }
}
