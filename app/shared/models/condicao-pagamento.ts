import { Situacao } from "./enums/situacao";

export class CondicaoPagamento {
  public idCondicaoPagamento: number;
  public codigo: string;
  public situacao: Situacao;
  public descricao: string;
  public idTenant: number;
}