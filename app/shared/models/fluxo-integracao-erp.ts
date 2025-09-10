import { SituacaoFluxoIntegracaoErp } from './enums/situacao-fluxo-integracao-erp.enum';
import { TipoPedidoFluxoIntegracaoErp } from './enums/tipo-pedido-fluxo-integracao-erp.enum';

export class FluxoIntegracaoErp {

  // O ID Fluxo Integração  pode ser o de Pedido ou de RequisicaoItem.
  idFluxoIntegracaoErp: number;

  // O ID pode ser o de Pedido ou de RequisicaoItem.
  id: number;

  dataHora: string;
  situacao: SituacaoFluxoIntegracaoErp;
  tipo: TipoPedidoFluxoIntegracaoErp;
  mensagem: string;
  reenviado: boolean;
  permiteReenvio: boolean;

  get idPedidoFluxoIntegracao(): number {
    return this.idFluxoIntegracaoErp;
  }
  set idPedidoFluxoIntegracao(idPedidoFluxoIntegracao: number) {
    this.idFluxoIntegracaoErp = idPedidoFluxoIntegracao;
  }

  get idRequisicaoFluxoIntegracao(): number {
    return this.idFluxoIntegracaoErp;
  }
  set idRequisicaoFluxoIntegracao(idRequisicaoFluxoIntegracao: number) {
    this.idFluxoIntegracaoErp = idRequisicaoFluxoIntegracao;
  }

  get idPedido(): number {
    return this.id;
  }
  set idPedido(idPedido: number) {
    this.id = idPedido;
  }

  get idRequisicaoItem(): number {
    return this.id;
  }
  set idRequisicaoItem(idRequisicaoItem: number) {
    this.id = idRequisicaoItem;
  }

  constructor(init?: Partial<FluxoIntegracaoErp>) {
    Object.assign(this, init);
  }

}
