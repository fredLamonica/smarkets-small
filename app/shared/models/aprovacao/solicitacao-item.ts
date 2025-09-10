import { SolicitacaoItemAnalise } from './solicitacao-item-analise';
import { AnaliseAprovacaoPedidoItem } from './../enums/analise-aprovacao-pedido-item';
import { PedidoItem } from "../pedido/pedido-item";

export class SolicitacaoItem {
  public idSolicitacaoItem: number;
  public idSolicitacao: number;
  public idPedidoItem: number;
  public pedidoItem: PedidoItem;
  public situacao: AnaliseAprovacaoPedidoItem;
  public observacao: string;
  public analise: SolicitacaoItemAnalise;
}