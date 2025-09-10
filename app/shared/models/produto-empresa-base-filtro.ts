import { Ordenacao } from '.';
import { SituacaoProduto } from './enums/situacao-produto';

export class ProdutoEmpresaBaseFiltro {

  itensPorPagina: number;
  pagina: number;
  totalDePaginas: number;
  ordenarPor: string;
  ordenacao: Ordenacao;
  idProduto: number;
  codigo: string;
  descricao: string;
  situacao: SituacaoProduto;
  idCategoriaProduto: number;
  idUnidadeMedida: number;

  constructor(init?: Partial<ProdutoEmpresaBaseFiltro>) {
    Object.assign(this, init);
  }

}
