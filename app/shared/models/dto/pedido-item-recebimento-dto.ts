import { Produto } from '..';

export class PedidoItemRecebimentoDto {
  public quantidadeRecebida: number;
  public produto: Produto;
  public quantidadePedidoItem: number;
  public quantidadeSaldo: number;
  public quantidadeSaldoCancelado: number;
}
