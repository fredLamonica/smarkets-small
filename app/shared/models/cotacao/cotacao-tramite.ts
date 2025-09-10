import { SituacaoCotacao } from '../enums/situacao-cotacao';

export class CotacaoTramite {
  public idCotacaoTramite: number;
  public idCotacao: number;
  public situacao: SituacaoCotacao;
  public dataTramite: string;
}