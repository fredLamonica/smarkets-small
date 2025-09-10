import { StatusPrecificacaoIA } from './enums/status-precificacao-ia';
import { FornecedoresPrecificacaoProdutoIA } from './fornecedores-precificacao-produto-ia';

export class PrecificacaoProdutoIA{
  idPrecificacaoProdutoIA: number;
  idProduto: number;
  status: StatusPrecificacaoIA;
  dataInput: string;
  dataOutput: string;
  sla: number;
  precoMinimo: string;
  precoMedio: string;
  valoresFornecedores: Array<FornecedoresPrecificacaoProdutoIA>;
  idTenant: number;
}

