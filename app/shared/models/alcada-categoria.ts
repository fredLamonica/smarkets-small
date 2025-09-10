export class AlcadaCategoria {

  idAlcada: number;
  idCategoriaProduto: number;

  constructor(init?: Partial<AlcadaCategoria>) {
    Object.assign(this, init);
  }

}
