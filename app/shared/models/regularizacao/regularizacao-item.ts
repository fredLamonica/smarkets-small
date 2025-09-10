import { Marca } from '../marca';
import { Produto } from '../produto';

export class RegularizacaoItem {

  idRegularizacaoItem: number;
  idRegularizacao: number;
  idTenant: number;
  quantidade: number;
  dataInclusao?: string;
  observacao: string;
  valorUnitario?: number;
  idMarca?: number;
  marca: Marca;
  idProduto: number;
  produto: Produto;
  dataEntrega?: string;
  minDataEntrega?: string;
  ultimaAlteracao: string;
  selecionado: boolean = false;

  constructor(init?: Partial<RegularizacaoItem>) {
    Object.assign(this, init);
  }

}
