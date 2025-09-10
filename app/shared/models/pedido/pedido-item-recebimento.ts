import { PedidoItemRecebimentoHistorico } from './pedido-item-recebimento-historico';

export class PedidoItemRecebimento {
  public idPedidoItemRecebimento: number;

  public idPedidoItemRecebimentoHistorico: number;
  public pedidoItemRecebimentoHistorico: PedidoItemRecebimentoHistorico;

  public descricaoItem: string;
  public idPedidoItem: number;
  public idTenant: number;
  public quantidadePedidoItem: number;
  public quantidadeSaldo: number;
  public quantidadeRecebida: number;
  public quantidadeSaldoCancelado: number;


  constructor(
    idPedidoItem: number,
    descricaoItem: string,
    quantidade: number,
    quantidadeSaldo: number,
    quantidadeRecebida: number,
    quantidadeSaldoCancelado: number
  ) {
    this.idPedidoItem = idPedidoItem;
    this.descricaoItem = descricaoItem;
    this.quantidadePedidoItem = quantidade;
    this.quantidadeSaldo = quantidadeSaldo;
    this.quantidadeRecebida = quantidadeRecebida;
    this.quantidadeSaldoCancelado = quantidadeSaldoCancelado;
  }
}
