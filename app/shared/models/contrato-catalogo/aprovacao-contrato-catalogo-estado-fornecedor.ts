import { AnaliseAprovacaoCatalogo } from '../enums/analise-aprovacao-catalogo';
import { AprovacaoItemContratoFornecedor as AprovacaoContratoFornecedor } from '../enums/aprovacao-item-contrato-fornecedor';
import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';


export class AprovacaoContratoCatalogoEstadoFornecedor{
  idAprovacaoContratoCatalogoEstadoFornecedor: number;
  idContratoCatalogoEstado: number;
  valorMinimoPedido: number;
  prazoEntrega: number;
  dataInclusao: Date;
  situacao: AprovacaoContratoFornecedor;
  situacaoEstado: SituacaoContratoCatalogoItem;
  justificativa: string;
  situacaoEstadoOld: SituacaoContratoCatalogoItem;
  confirmado: boolean;
  aprovado: AnaliseAprovacaoCatalogo;
}
