import { FiltroBase } from '../fltros/base/filtro-base';

export class HistoricoPedidosFiltroDto extends FiltroBase {

  marca: string;
  origem: string;
  razaoSocial: string;
  descricaoProduto: string;
  idOrigem: number;

  constructor(init?: Partial<HistoricoPedidosFiltroDto>) {
    super();
    Object.assign(this, init);
  }
}
