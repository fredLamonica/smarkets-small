import { SituacaoProdutoIA } from '../enums/situacao-produto-ia';
import { FiltroBase } from './base/filtro-base';

export class ProdutoFiltro extends FiltroBase {
  idCategoria: number;
  descricao: string;
  codigo: string;
  situacao: number;
  situacaoIA: SituacaoProdutoIA;
  filtroAvancado: boolean;
}
