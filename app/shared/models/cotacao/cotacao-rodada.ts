import { CotacaoItem } from './cotacao-item';
import { CotacaoRodadaProposta } from './cotacao-rodada-proposta';
import { CotacaoParticipante } from './cotacao-participante';
import { Arquivo } from '../arquivo';

export class CotacaoRodada {
  public idCotacaoRodada: number;
  public idCotacao: number;
  public dataInicio: string;
  public dataEncerramento: string;
  public dataFimProrrogada: string;
  public dataFimProgramada: string;
  public finalizada: boolean;
  public ordem: number;
  public motivoEncerramentoAntecipado: string;

  //Utilizado nas propostas
  public itens: Array<CotacaoItem>;

  //Utilizado na analise
  public propostas: Array<CotacaoRodadaProposta>;
  public targetPrice: number;

  //Utilizado em novas rodadas
  public participantes: Array<CotacaoParticipante>;

  public anexos: Array<Arquivo>;
}
