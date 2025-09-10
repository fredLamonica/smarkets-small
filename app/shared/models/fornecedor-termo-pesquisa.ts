import { Situacao, TermoPesquisa } from '.';

export class FornecedorTermoPesquisa {
  public idFornecedorTermoPesquisa: number;
  public idFornecedor: number;
  public idTermoPesquisa: number;
  public termoPesquisa: TermoPesquisa;
  public situacao: Situacao;

  constructor(idFornecedor?: number, idTermoPesquisa?: number, situacao?: Situacao) {
    this.idFornecedor = idFornecedor;
    this.idTermoPesquisa = idTermoPesquisa;
    this.situacao = situacao;
  }
}
