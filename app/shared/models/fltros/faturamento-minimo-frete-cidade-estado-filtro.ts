import { TipoFrete } from '../enums/tipo-frete';
import { FiltroBase } from './base/filtro-base';

export class FaturamentoMinimoFreteCidadeEstadoFiltro extends FiltroBase {

  termo: string;
  idPessoa: number;
  idCidade?: number;
  idEstado?: number;
  tipoFrete: TipoFrete;
  idFaturamento: number;

  constructor(init?: Partial<FaturamentoMinimoFreteCidadeEstadoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
