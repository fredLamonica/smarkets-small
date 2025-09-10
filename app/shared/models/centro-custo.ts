import { Situacao } from "./enums/situacao";

export class CentroCusto {
  public idCentroCusto: number;
  public codigo: string;
  public idTenant: number;
  public situacao: Situacao;
  public descricao: string;
  public idCentroCustoPai: number;
  public idUsuarioResponsavel: number;
  public filhos: Array<CentroCusto>;
  public codigoDefault: boolean;
}
