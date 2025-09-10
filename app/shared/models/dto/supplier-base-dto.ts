import { PessoaJuridica, StatusFornecedor } from '..';
import { ISelectable } from '../interfaces/ISelectable';

export class SupplierBaseDto implements ISelectable {
  public idFornecedor: number;
  public idPessoaJuridicaFornecedor: number;
  public documento: string;
  public razaoSocial: string;
  public status: StatusFornecedor;
  public idTenant: number;
  public selected: boolean;
  public idPessoaJuridicaOrigem: number;
  public pessoaJuridicaOrigem: string;
}
