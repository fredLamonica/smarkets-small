import { StatusFornecedor, StatusFornecedorLabel } from '../enums/status-fornecedor';
import { FilterBase } from './filter-base';

export class SupplierBaseFilter extends FilterBase {
  public documento: string;
  public razaoSocial: string;
  public status?: StatusFornecedor;

  private statusFornecedorLabel = StatusFornecedorLabel;
  set _status(value: any) {
    if (value) this.status = this.getKeyByValue(this.statusFornecedorLabel, value.label);
    else this.status = null;
  }
  get _status(): any {
    return this.statusFornecedorLabel.get(this.status);
  }

  private getKeyByValue(dictionary: Map<number, string>, value): number {
    return Array.from(dictionary.keys()).find(key => dictionary.get(key).valueOf() == value);
  }
}
