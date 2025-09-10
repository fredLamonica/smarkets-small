import { CotacaoParticipanteMapaComparativoPorItem } from './cotacao-participante-mapa-comparativo-por-item';
import { SituacaoCotacao } from '@shared/models/enums/situacao-cotacao';
import { PessoaJuridica } from '@shared/models/pessoa-juridica';
import { Usuario } from '@shared/models/usuario';
import { Moeda } from '@shared/models/enums/moeda';
import { Arquivo } from '@shared/models/arquivo';
import { VisualizacaoCotacao } from '@shared/models/cotacao/visualizacao-cotacao';
import { CotacaoItemMapaComparativoPorItem } from './cotacao-item-mapa-comparativo-por-item';

export class CotacaoMapaComparativoPorItem {
  public idCotacao: number;
  public codigo: string;
  public dataInclusao: string;
  public situacao: SituacaoCotacao;
  public idTenant: number;
  public empresa: PessoaJuridica;
  public descricao: string;
  public idUsuarioCriador: number;
  public idUsuarioResponsavel: number;
  public usuarioResponsavel: Usuario;
  public dataInicio: string;
  public dataFim: string;
  public moeda: Moeda;
  public possuiTermoConcordancia: boolean;
  public termoConcordancia: string;
  public anexos: Arquivo[];
  public participantes: CotacaoParticipanteMapaComparativoPorItem[];
  public itens: CotacaoItemMapaComparativoPorItem[];
  public visualizacoes: VisualizacaoCotacao[];
  public participantesResponderam: CotacaoParticipanteMapaComparativoPorItem[];  
  public participantesRecusaram: CotacaoParticipanteMapaComparativoPorItem[];
  public categorias: string;
}