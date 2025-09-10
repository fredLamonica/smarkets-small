import { OrigemPedido } from '../enums/origem-pedido';
import { SituacaoPedido } from '../enums/situacao-pedido';

export class PedidoFiltro {
  numeroPedido: number;
  codigoPedido: string;
  origemPedido: OrigemPedido;
  idOrigemPedido: number;
  codigoRc: string;
  cliente: string;
  fornecedor: string;
  solicitante: string;
  situacao: SituacaoPedido;
  dataCriacao: Date;
  dataUltimaAtualizacao: Date;
  usuarioAprovador: string;
  codigoProduto: string;
  codigoProdutoERP: string;
  descricaoProduto: string;
  ordenarPor: string;
  constructor(
    numeroPedido: number,
    codigoPedido: string,
    origemPedido: OrigemPedido,
    idOrigemPedido: number,
    codigoRc: string,
    cliente: string,
    fornecedor: string,
    solicitante: string,
    situacao: SituacaoPedido,
    dataCriacao: Date,
    dataUltimaAtualizacao: Date,
    usuarioAprovador: string,
    codigoProduto: string,
    codigoProdutoERP: string,
    descricaoProduto: string,
    ordenarPor: string,
  ) {
    this.numeroPedido = numeroPedido;
    this.codigoPedido = codigoPedido;
    this.origemPedido = origemPedido;
    this.idOrigemPedido = idOrigemPedido;
    this.codigoRc = codigoRc;
    this.cliente = cliente;
    this.fornecedor = fornecedor;
    this.solicitante = solicitante;
    this.situacao = situacao;
    this.dataCriacao = dataCriacao;
    this.dataUltimaAtualizacao = dataUltimaAtualizacao;
    this.usuarioAprovador = usuarioAprovador;
    this.codigoProduto = codigoProduto;
    this.codigoProdutoERP = codigoProdutoERP;
    this.descricaoProduto = descricaoProduto;
    this.ordenarPor = ordenarPor;
  }
}
