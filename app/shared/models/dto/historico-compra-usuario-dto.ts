import { OrigemPedido } from '../enums/origem-pedido';

export class HistoricoCompraUsuarioDto {
  idPedido: number;
  origemPedido: OrigemPedido;
  DescricaoProduto: string;
  marca: string;
  razaoSocial: string;
  quantidade: string;
  valorUnitario: number;
  valorTotal: number;
}
