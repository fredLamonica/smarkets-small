import { SituacaoSolicitacaoItemCompra } from '../enums/situacao-solicitacao-item-compra';
import { RequisicaoItem } from '../requisicao/requisicao-item';
import { SubItemSolicitacaoCompraComentario } from './sub-item-solicitacao-compra-comentario';
import { Arquivo } from '../arquivo';
import { PedidoItem } from '../pedido/pedido-item';
import { PessoaJuridica } from '../pessoa-juridica';

export class SubItemSolicitacaoCompra {
  public idSubItemSolicitacaoCompra: number;
  public idItemSolicitacaoCompra: number;
  public idTenant: number;
  public idSubItemSap: number;
  public numeroPacoteServico: number;
  public nomeServico: string;
  public numeroServico: string;
  public quantidade: number;
  public siglaUnidadeMedida: string;
  public precoBruto: number;
  public precoLiquido: number;
  public codigoCategoria: string;
  public valorReferencia: number;
  public codigoTarifaFiscal: string;
  public situacao: SituacaoSolicitacaoItemCompra;
  public comentarios: Array<SubItemSolicitacaoCompraComentario>;
  public anexos: Array<Arquivo>;
  public pedidoItem: PedidoItem;
  public requisicaoItem: RequisicaoItem;
  public pessoaJuridica: PessoaJuridica;
}