import { OrigemPedidoTrack } from '../../enums/Track/origem-pedido-track';
import { SituacaoPedidoTrack } from '../../enums/Track/situacao-pedido-track';
import { TipoOperacaoTrack } from '../../enums/Track/tipo-operacao-track';
import { FiltroBase } from '../base/filtro-base';

export interface ParadaManutencaoFiltroDto extends FiltroBase {
  numerosPedidos?: number[],
  dataRecebimento?: Date,
  dataEntrega?: Date,
  dataColetaImportacao?: Date,
  fornecedor?: string,
  tipoOperacao: TipoOperacaoTrack,
  situacoes?: SituacaoPedidoTrack[],
  responsavel?: string,
  descricaoPedido?: string,
  dataInicio?: Date,
  dataFim?:Date
  dataRemessaInicio?: Date,
  dataRemessaFim?: Date,
  idTenant: number;
  empresa?: string;
  origemPedido?: OrigemPedidoTrack

}
