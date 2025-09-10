import { StatusSla } from '../enums/status-sla';
import { TipoSlaSolicitacao } from '../enums/tipo-sla-solicitacao';
import { UnidadeMedidaTempoSla } from '../enums/unidade-medida-tempo-sla';

export class SlaSolicitacao {
  idSlaSolicitacao: number;
  idTenant: number;
  classificacao: string;
  unidadeMedidaTempo: UnidadeMedidaTempoSla;
  tempo: number;
  tipoSlaSolicitacao: TipoSlaSolicitacao;
  statusSla: StatusSla;
  dataInclusao: Date;
  dataExclusao: Date;
  classificacaoSmarkets: string;
  slaSmarkets: boolean;
  descricaoTempo: string;

  constructor(init?: Partial<SlaSolicitacao>) {
    Object.assign(this, init);
  }
}
