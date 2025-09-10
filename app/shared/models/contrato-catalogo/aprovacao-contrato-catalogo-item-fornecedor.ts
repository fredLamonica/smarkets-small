import { SituacaoContratoCatalogoItem } from '@shared/models';
import { AnaliseAprovacaoCatalogo } from '../enums/analise-aprovacao-catalogo';
import { AprovacaoItemContratoFornecedor } from '../enums/aprovacao-item-contrato-fornecedor';
import { Garantia } from '../enums/garantia';
import { Moeda } from '../enums/moeda';
import { TipoFrete } from '../enums/tipo-frete';

export class AprovacaoContratoCatalogoItemFornecedor{
  idAprovacaoContratoCatalogoItemFornecedor: number;
  idContratoCatalogoItem: number;
  valor: number;
  frete: TipoFrete;
  loteMinimo: number;
  garantia: Garantia;
  moeda: Moeda;
  dataInclusao: Date;
  situacao: AprovacaoItemContratoFornecedor;
  situacaoContratoCatalogoItem: SituacaoContratoCatalogoItem;
  justificativa: string;
  situacaoItemOld: SituacaoContratoCatalogoItem;
  confirmado: boolean;
  aprovado: AnaliseAprovacaoCatalogo;
}
