import { SolicitacaoDocumentoFornecedorValidacao } from './../solicitacao-documento-fornecedor-validacao';
import { SituacaoValidacaoDocumentoFornecedor } from './../enums/situacao-validacao-documento-fornecedor';

export class SolicitacaoDocumentoFornecedorValidacaoDto {
  public idSolicitacaoDocumentoFornecedorValidacao: number;
  public idSolicitacaoDocumentoFornecedorArquivo: number;
  public situacaoValidacaoArquivo: SituacaoValidacaoDocumentoFornecedor;
  public idTenant: number;
  public motivoRecusa: string;
  public idFornecedor: number;

  public nomeDocumento: string;
  public razaoSocial: string;
  public idPessoaJuridicaFornecedor: number;

  constructor(solicitacaoDocumentoFornecedorValidacao: SolicitacaoDocumentoFornecedorValidacao) {
    this.idSolicitacaoDocumentoFornecedorValidacao =
      solicitacaoDocumentoFornecedorValidacao.idSolicitacaoDocumentoFornecedorValidacao;
    this.idSolicitacaoDocumentoFornecedorArquivo =
      solicitacaoDocumentoFornecedorValidacao.idSolicitacaoDocumentoFornecedorArquivo;
    this.situacaoValidacaoArquivo =
      solicitacaoDocumentoFornecedorValidacao.situacaoValidacaoArquivo;
    this.idTenant = solicitacaoDocumentoFornecedorValidacao.idTenant;
    this.motivoRecusa = solicitacaoDocumentoFornecedorValidacao.motivoRecusa;
  }
}
