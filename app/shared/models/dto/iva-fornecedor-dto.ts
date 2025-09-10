export class IvaFornecedorDto {
  public idPessoaJuridicaFornecedor: number;
  public idIva: number;

  constructor(idPessoaJuridicaFornecedor: number, idIva: number) {
    this.idPessoaJuridicaFornecedor = idPessoaJuridicaFornecedor;
    this.idIva = idIva;
  }
}
