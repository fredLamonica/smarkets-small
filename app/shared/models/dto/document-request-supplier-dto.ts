import { ISelectable } from '../interfaces/ISelectable';
import { PessoaJuridica } from '../pessoa-juridica';

export class DocumentRequestSupplierDto implements ISelectable {
  public idSolicitacaoDocumentoFornecedor: number;
  public idTenant: number;
  public solicitante: PessoaJuridica;
  public idDocumentoFornecedor: number;
  public descricaoDocumento: string;

  private _selected: boolean;
  public set selected(value: boolean) {
    this._selected = value;
  }
  public get selected(): boolean {
    return this._selected;
  }

  constructor(
    idSolicitacaoDocumentoFornecedor: number,
    idTenant: number,
    solicitante: PessoaJuridica,
    idDocumentoFornecedor: number,
    descricaoDocumento: string,
    selected: boolean
  ) {
    this.idSolicitacaoDocumentoFornecedor = idSolicitacaoDocumentoFornecedor;
    this.idTenant = idTenant;
    this.solicitante = solicitante;
    this.idDocumentoFornecedor = idDocumentoFornecedor;
    this.descricaoDocumento = descricaoDocumento;
    this._selected = selected;
  }
}
