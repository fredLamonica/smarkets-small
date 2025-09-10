import { OrigemPedido } from '../enums/origem-pedido';
import { SituacaoPedido } from '../enums/situacao-pedido';
import { FiltroBase } from '../fltros/base/filtro-base';

export class PedidoFiltroDto extends FiltroBase {

  idPedido: number;
  situacao: SituacaoPedido;
  dataCriacaoInicio: string;
  dataCriacaoFim: string;
  dataUltimaAtualizacaoInicio: string;
  dataUltimaAtualizacaoFim: string;
  dataAprovacaoInicio: string;
  dataAprovacaoFim: string;
  dataAprovacaoFornecedorInicio: string;
  dataAprovacaoFornecedorFim: string;
  dataEntregaInicio: string;
  dataEntregaFim: string;
  origem: OrigemPedido;
  idOrigem: number;
  cliente: string;
  fornecedor: string;
  usuarioResponsavel: string;
  usuarioAprovador: string;
  pedidoErp: string;
  requisicaoErp: string;
  idChamado: string;
  descricaoItem: string;

  constructor(init?: Partial<PedidoFiltroDto>) {
    super();
    Object.assign(this, init);
  }
}
