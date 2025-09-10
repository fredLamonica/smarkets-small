import { SituacaoValidacaoDocumentoFornecedor } from '.';

export class SolicitacaoDocumentoFornecedorValidacao {
  public idSolicitacaoDocumentoFornecedorValidacao: number;
  public idSolicitacaoDocumentoFornecedorArquivo: number;
  public situacaoValidacaoArquivo: SituacaoValidacaoDocumentoFornecedor;
  public idTenant: number;
  public motivoRecusa: string;

  constructor(
    idSolicitacaoDocumentoFornecedorValidacao?: number,
    idSolicitacaoDocumentoFornecedorArquivo?: number,
    situacaoValidacaoArquivo?: SituacaoValidacaoDocumentoFornecedor,
    idTenant?: number,
    motivoRecusa?: string
  ) {
    this.idSolicitacaoDocumentoFornecedorValidacao = idSolicitacaoDocumentoFornecedorValidacao;
    this.idSolicitacaoDocumentoFornecedorArquivo = idSolicitacaoDocumentoFornecedorArquivo;
    this.situacaoValidacaoArquivo = situacaoValidacaoArquivo;
    this.idTenant = idTenant;
    this.motivoRecusa = motivoRecusa;
  }
}
