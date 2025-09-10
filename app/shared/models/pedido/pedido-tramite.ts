import { SituacaoPedido } from './../enums/situacao-pedido';
import { Pedido } from './pedido';
export class PedidoTramite {
  public idPedidoTramite: Number;
  public idPedido: Number;
  public situacao: SituacaoPedido;
  public idUsuario: number;
  public dataInclusao: string;
  public observacao: string;
  public pedido: Pedido;

  constructor(idPedidoTramite: number, idPedido: number, situacao: SituacaoPedido, idUsuario: number, dataInclusao: string, observacao: string, pedido: Pedido) {
    this.idPedidoTramite = idPedidoTramite;
    this.idPedido = idPedido;
    this.situacao = situacao;
    this.idUsuario = idUsuario;
    this.dataInclusao = dataInclusao;
    this.observacao = observacao;
    this.pedido = pedido;
  }
}