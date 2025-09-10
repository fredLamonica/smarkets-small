import { SituacaoRequisicaoItem } from '../enums/situacao-requisicao-item';
import { FiltroBase } from '../fltros/base/filtro-base';

export class RequisicaoFiltroDto extends FiltroBase {

  idRequisicao: number;
  situacao: SituacaoRequisicaoItem;
  dataCriacaoInicio: string;
  dataCriacaoFim: string;
  idUsuarioSolicitante: number;
  idUsuarioResponsavel: number;
  centro: string;
  codigoRc: string;
  idChamado: string;
  descricaoItem: string;

  constructor(init?: Partial<RequisicaoFiltroDto>) {
    super();
    Object.assign(this, init);
  }

}
