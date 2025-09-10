import { SituacaoPedidoTrack } from '../../enums/Track/situacao-pedido-track';
import { FiltroBase } from '../base/filtro-base';

export interface TrackFiltroDto extends FiltroBase {
  numerosPedidos?: number[],
  situacoes?: SituacaoPedidoTrack[],
  requisitante?: string,
  descricaoPedido?: string,
  dataRemessaInicio?: Date,
  dataRemessaFim?: Date,
  linhaItem?: string
  idTenant: number;
}
