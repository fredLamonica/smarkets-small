import { CotacaoPropostaItem } from './cotacao-proposta-item';

export class CotacaoProposta {
  public idCotacaoProposta: number;
  public idCotacao: number;
  public idTenant: number;
  public idPessoaJuridica: number;
  public enviada: boolean;
  public itens: Array<CotacaoPropostaItem>;

  constructor(idCotacaoProposta: number, idCotacao: number, idTenant: number, idPessoaJuridica: number, enviada: boolean, itens: Array<CotacaoPropostaItem>) {
    this.idCotacaoProposta = idCotacaoProposta;
    this.idCotacao = idCotacao;
    this.idTenant = idTenant;
    this.idPessoaJuridica = idPessoaJuridica;
    this.enviada = enviada;
    this.itens = itens;
  }
}