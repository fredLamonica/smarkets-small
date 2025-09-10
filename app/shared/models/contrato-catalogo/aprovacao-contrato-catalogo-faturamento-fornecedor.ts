import { AnaliseAprovacaoCatalogo } from '../enums/analise-aprovacao-catalogo';
import { AprovacaoItemContratoFornecedor } from '../enums/aprovacao-item-contrato-fornecedor';
import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';


export class AprovacaoContratoCatalogoFaturamentoFornecedor{
  idAprovacaoContratoCatalogoFaturamentoFornecedor: number;
  idContratoCatalogoFaturamento: number;
  valorMinimoPedido: number;
  dataInclusao: Date;
  situacao: AprovacaoItemContratoFornecedor;
  situacaoFaturamento: SituacaoContratoCatalogoItem;
  justificativa: string;
  situacaoFaturamentoOld: SituacaoContratoCatalogoItem;
  confirmado: boolean;
  aprovado: AnaliseAprovacaoCatalogo;
}
