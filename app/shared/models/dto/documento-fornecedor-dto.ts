export class DocumentoFornecedorDto {
  public idDocumentoFornecedor: number;
  public descricaoDocumento: string;

  public idDocumentoFornecedorTenant: number;
  public idTenant: number;
  public documentoObrigatorio: boolean;
  public vencimentoObrigatorio: boolean;

  public desabilitaTrocaDocumentoObrigatorio: boolean;
  public desabilitaTrocaVencimentoObrigatorio: boolean;

  constructor(idDocumentoFornecedor: number, descricaoDocumento: string) {
    this.idDocumentoFornecedor = idDocumentoFornecedor;
    this.descricaoDocumento = descricaoDocumento;
  }
}
