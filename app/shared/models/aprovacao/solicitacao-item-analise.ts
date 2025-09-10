import { AnaliseAprovacaoPedidoItem } from './../enums/analise-aprovacao-pedido-item';

export class SolicitacaoItemAnalise {
  public idSolicitacaoItemAnalise: number;
  public idSolicitacaoItem: number;
  public idUsario: number;
  public situacao: AnaliseAprovacaoPedidoItem;
  public observacao: string;
  public dataInclusao: string;

  constructor(idSolicitacaoItemAnalise: number, idSolicitacaoItem: number, idUsuario: number, situacao: AnaliseAprovacaoPedidoItem, observacao: string) {
    this.idSolicitacaoItemAnalise = idSolicitacaoItemAnalise;
    this.idSolicitacaoItem = idSolicitacaoItem;
    this.idUsario = idUsuario;
    this.situacao = situacao;
    this.observacao = observacao;
  }
}