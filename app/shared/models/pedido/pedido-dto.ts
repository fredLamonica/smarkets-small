import { SituacaoPedido } from '../enums/situacao-pedido';

export class PedidoDto {

  idPedido: number;
  idTenant: number;
  origem: string;
  situacao?: SituacaoPedido;
  cnpjCliente: string;
  cliente: string;
  cnpjFornecedor: number;
  fornecedor: string;
  usuarioResponsavel: string;
  usuarioAprovador: string;
  centroCusto: string;
  contaContabil: string;
  dataDaCriacao: Date;
  dataUltimaAtualizacao: Date;
  dataAprovacao: Date;
  dataAprovacaoFornecedor: Date;
  dataEntrega: Date;
  dataEntregaPrevista: Date;
  valor: number;
  possuiItemComEntregaProgramada: boolean;
  pedidoErp: string;
  requisicaoErp: string;
  idChamado: string;
  visualizacaoFornecedor;

  constructor(init?: Partial<PedidoDto>) {
    Object.assign(this, init);
  }

}
