import { ISelectable } from '../interfaces/ISelectable';

export class FornecedorCategoriaFornecimentoDto implements ISelectable {
  public idCategoriaFornecimento: number;
  public descricao: string;
  public possuiCategoria: boolean;

  private _selected: boolean;
  public set selected(value: boolean) {
    this._selected = value;
  }
  public get selected(): boolean {
    return this._selected;
  }

  constructor(
    idCategoriaFornecimento: number,
    descricao: string,
    possuiCategoria: boolean,
    selected: boolean = possuiCategoria
  ) {
    this.idCategoriaFornecimento = idCategoriaFornecimento;
    this.descricao = descricao;
    this.possuiCategoria = possuiCategoria;
    this._selected = selected;
  }
}
