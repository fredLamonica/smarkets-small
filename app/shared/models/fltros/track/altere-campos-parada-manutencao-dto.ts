import { SituacaoPedidoTrack } from '../../enums/Track/situacao-pedido-track';

export interface AltereCamposParadaManutencaoDto{
  idsPedido: number[],
  idTenant: number,
  situacaoPedido: SituacaoPedidoTrack,
  dataRemessa: Date,
  dataRemessa2: Date,
  motivo: string,
  observacao: string,
}
