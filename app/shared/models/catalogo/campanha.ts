import { ContratoCatalogo } from '../contrato-catalogo/contrato-catalogo';
import { CampanhaParticipante } from './campanha-participante';
import { SituacaoCampanha } from '../enums/situacao-campanha';
import { Arquivo } from '..';

export class Campanha {
  public idCampanha: number;
  public idTenant: number;
  public situacao: SituacaoCampanha;
  public nome: string;
  public url: string;
  public apresentacao: string;
  public termos: string;
  public dataInicio: string;
  public dataFim: string;
  public contratos: Array<ContratoCatalogo>;
  public participantes: Array<CampanhaParticipante>;
  public imagem: Arquivo;
}
