import { SolicitacaoItem } from './solicitacao-item';
import { SituacaoSolicitacaoAprovacao } from './../enums/situacao-solicitacao-aprovacao';
import { TipoSolicitacaoAprovacao } from "../enums/tipo-solicitacao-aprovacao";
import { Pedido } from '../pedido/pedido';

export class Solicitacao {
  public idSolicitacao: number;
  public idPedido: number;
  public idUsuario: number;
  public tipo: TipoSolicitacaoAprovacao;
  public situacao: SituacaoSolicitacaoAprovacao;
  public dataSolicitacao: string;
  public observacao: string;
  public pedido: Pedido;
  public solicitacaoItens: Array<SolicitacaoItem>;
  public idNivel: number;
  public idUsuarioAprovadorAtual: number;
}