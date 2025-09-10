import { PessoaJuridica } from '..';
import { Arquivo } from '../arquivo';
import { Moeda } from '../enums/moeda';
import { SituacaoCotacao } from '../enums/situacao-cotacao';
import { Usuario } from '../usuario';
import { CotacaoItem } from './cotacao-item';
import { CotacaoParticipante } from './cotacao-participante';
import { CotacaoRodada } from './cotacao-rodada';
import { CotacaoTramite } from './cotacao-tramite';

export class Cotacao {
  idCotacao: number;
  codigo: string;
  processo: string;
  dataInclusao: string;
  situacao: SituacaoCotacao;
  tramites: Array<CotacaoTramite>;
  idTenant: number;
  descricao: string;
  idUsuarioCriador: number;
  idUsuarioResponsavel: number;
  usuarioResponsavel: Usuario;
  dataInicio: string;
  dataFim: string;
  moeda: Moeda;
  termoConcordancia: string;
  possuiTermoConcordancia: boolean;
  itens: Array<CotacaoItem>;
  anexos: Array<Arquivo>;
  participantes: Array<CotacaoParticipante>;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  quantidadeParticipantes: number;
  propostasRecebidas: number;
  visualizacoes: number;
  quantidadeItensFechados: number;
  quantidadeItensCotados: number;
  pessoaJuridicaCliente: PessoaJuridica;

  rodadaAtual: CotacaoRodada;
  dataHoraSla: Date;
  flagCotacaoItemVisivel: boolean;
}
