import { SituacaoAceitePedidoTrack } from '../enums/Track/situacao-aceite-pedido-track';
import { SituacaoNotificacaoTrack } from '../enums/Track/situacao-notificacao-track';
import { SituacaoPedidoTrack } from '../enums/Track/situacao-pedido-track';

export interface PedidoTrackDto {
  id: number;
  numeroPedido: number;
  linha: string;
  descricaoPedido: string;
  dataPedido: Date;
  dataRecebimento: Date;
  fornecedor: string;
  responsavel: string
  dataColetaImportacao: Date;
  situacaoPedido: SituacaoPedidoTrack;
  aceitePedido: SituacaoAceitePedidoTrack;
  notificacao: SituacaoNotificacaoTrack;
  dataRemessa: Date;
  dataRemessa2: Date;
  observacao: string;
  motivo: string;
}
