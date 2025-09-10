export class ObservacaoSolicitacaoFornecedor {
  public idSolicitacaoFornecedor: number;
  public idSolicitacaoFornecedorObservacao: number;
  public observacao: string;
  public idUsuario: number;
  public nomeUsuario: string;
  public data: string;

  constructor(init?: Partial<ObservacaoSolicitacaoFornecedor>) {
    Object.assign(this, init);
  }
}
