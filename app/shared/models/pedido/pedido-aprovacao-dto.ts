import { SolicitacaoItemAnalise } from '../aprovacao/solicitacao-item-analise';
import { PedidoItemDataEntregaPrevistaDto } from './pedido-item-data-entrega-prevista-dto';

export class PedidoAprovacaoDto {
  idPedido: number;
  analises: SolicitacaoItemAnalise[];
  datasEntregasPrevistas: PedidoItemDataEntregaPrevistaDto[];

  constructor(init?: Partial<PedidoAprovacaoDto>) {
    Object.assign(this, init);
  }
}
