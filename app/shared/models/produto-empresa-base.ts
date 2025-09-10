import { CategoriaProduto } from './categoria-produto';
import { SituacaoProduto } from './enums/situacao-produto';
import { TipoProduto } from './enums/tipo-produto';
import { UnidadeMedida } from './unidade-medida';

export class ProdutoEmpresaBase {

  idProduto: number;
  idTenant: number;
  idCategoriaProduto: number;
  categoria: CategoriaProduto;
  idUnidadeMedida: number;
  unidadeMedida: UnidadeMedida;
  situacao: SituacaoProduto;
  tipo: TipoProduto;
  codigo: string;
  descricao: string;
  descricaoDetalhada: string;
  selected: boolean;

  constructor(init?: Partial<ProdutoEmpresaBase>) {
    Object.assign(this, init);
  }

}
