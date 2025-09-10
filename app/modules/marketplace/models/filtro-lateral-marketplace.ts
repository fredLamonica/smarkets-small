export class FiltroLateralMarketplace {
  idsEstados: Array<Number> = new Array<Number>();
  idsMarcas: Array<Number> = new Array<Number>();
  idsFornecedores: Array<Number> = new Array<Number>();
  idsCategorias: Array<Number> = new Array<Number>();
  idCategoriaProdutoPai: number;
  primeiroFiltroCategoria: boolean;

  constructor(init?: Partial<FiltroLateralMarketplace>) {
    Object.assign(this, init);
  }
}
