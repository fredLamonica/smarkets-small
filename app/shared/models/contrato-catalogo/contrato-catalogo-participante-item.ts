import { Alcada } from '../alcada';
import { CentroCusto } from './../centro-custo';
import { Situacao } from './../enums/situacao';
import { ContratoCatalogoItem } from './contrato-catalogo-item';
import { ContratoCatalogoParticipante } from './contrato-catalogo-participante';

export class ContratoCatalogoParticipanteItem {
  idContratoCatalogoParticipanteItem: number;
  idCentroCusto: number;
  centroCusto: CentroCusto;
  idAlcada: number;
  alcada: Alcada;
  idContratoCatalogoParticipante: number;
  contratoCatalogoParticipante: ContratoCatalogoParticipante;
  idContratoCatalogoItem: number;
  contratoCatalogoItem: ContratoCatalogoItem;
  idPessoaJuridica: number;
  idTenant: number;
  situacao: Situacao;
  quantidadeTotal: number;
  quantidadeSolicitada: number;
  quantidadeDisponivel: number;
}
