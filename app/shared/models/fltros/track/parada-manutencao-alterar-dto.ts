import { SituacaoPedidoTrack } from '../../enums/Track/situacao-pedido-track';

export interface ParadaManutencaoAlterarDto {
  id: number;
  situacaoPedido: SituacaoPedidoTrack;
  dataRemessa: Date;
  dataRemessa2: Date;
  observacao: string;
  motivo: string;
}
