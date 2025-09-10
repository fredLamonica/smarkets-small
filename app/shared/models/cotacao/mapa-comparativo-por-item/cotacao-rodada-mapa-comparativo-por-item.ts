import { CotacaoRodadaProposta } from '@shared/models';

export class CotacaoRodadaMapaComparativoPorItem {
  public idCotacaoRodada: number;
  public idCotacao: number;
  public finalizada: boolean;
  public ordem: number;
  public dataInicio: string;
  public dataEncerramento: string;
  public dataFimProgramada: string;
  public dataFimProrrogada: string;
  public targetPrice: number;
  public propostas: CotacaoRodadaProposta[];
}
