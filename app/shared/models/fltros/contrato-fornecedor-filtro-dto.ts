import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';
import { FiltroBase } from '../fltros/base/filtro-base';
import { SituacaoContratoCatalogo } from './../enums/situacao-contrato-catalogo';

export class ContratoFornecedorFiltroDto extends FiltroBase {

  idCatalogo: number;
  idProduto: number;
  codigo: string;
  descricao: string;
  situacaoCatalogo: SituacaoContratoCatalogo;
  situacaoItem: SituacaoContratoCatalogoItem;
  titulo: string;
  cliente: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  preco: number;
  quantidadeMinima: number;
  prazoEntrega: number;

  constructor(init?: Partial<ContratoFornecedorFiltroDto>) {
    super();
    Object.assign(this, init);
  }
}
