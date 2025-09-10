import { GestaoIntegracaoCondicaoPagamento } from './interfaces/gestao-integracao-condicao-pagamento';
import { GestaoIntegracaoFornecedor } from './interfaces/gestao-integracao-fornecedor';
import { GestaoIntegracaoProduto } from './interfaces/gestao-integracao-produto';

export class IntegracaoErp implements GestaoIntegracaoProduto, GestaoIntegracaoFornecedor, GestaoIntegracaoCondicaoPagamento {
  // O ID pode ser de uma integração de produto ou de fornecedor.
  id: number;

  // O ID do Vínculo de uma integração pode ser o ID de um produto ou o ID de um fornecedor.
  idVinculo: number;

  idPessoaJuridica: number;
  razaoSocial: string;
  cnpj: string;
  codigoIntegracao: string;

  get idGestaoIntegracaoProduto(): number {
    return this.id;
  }

  set idGestaoIntegracaoProduto(idGestaoIntegracaoProduto: number) {
    this.id = idGestaoIntegracaoProduto;
  }

  get idProduto(): number {
    return this.idVinculo;
  }

  set idProduto(idProduto: number) {
    this.idVinculo = idProduto;
  }

  get idGestaoIntegracaoFornecedor(): number {
    return this.id;
  }

  set idGestaoIntegracaoFornecedor(idGestaoIntegracaoFornecedor: number) {
    this.id = idGestaoIntegracaoFornecedor;
  }

  get idFornecedor(): number {
    return this.idVinculo;
  }

  set idFornecedor(idFornecedor: number) {
    this.idVinculo = idFornecedor;
  }

  get idGestaoIntegracaoCondicaoPagamento(): number {
    return this.id;
  }

  set idGestaoIntegracaoCondicaoPagamento(idGestaoIntegracaoCondicaoPagamento: number) {
    this.id = idGestaoIntegracaoCondicaoPagamento;
  }

  get idCondicaoPagamento(): number {
    return this.idVinculo;
  }

  set idCondicaoPagamento(idCondicaoPagamento: number) {
    this.idVinculo = idCondicaoPagamento;
  }

  constructor(init?: Partial<IntegracaoErp>) {
    Object.assign(this, init);
  }
}
