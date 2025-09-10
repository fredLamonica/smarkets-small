import { Competencia } from '../enums/competencia-relatorio-requisicao.enum';
import { SituacaoRequisicaoItem } from '../enums/situacao-requisicao-item';

export class RelatorioRequisicaoFiltro {
  competencia: Competencia;
  dataInicio: string;
  dataFim: string;
  empresas: Array<number>;
  status: Array<SituacaoRequisicaoItem>;
  responsaveis: Array<number>;
  solicitantes: Array<number>;

  constructor(init?: Partial<RelatorioRequisicaoFiltro>) {
    Object.assign(this, init);
  }
}
