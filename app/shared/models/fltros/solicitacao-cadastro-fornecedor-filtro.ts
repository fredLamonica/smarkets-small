
import { StatusSolicitacaoFornecedor, StatusSolicitacaoFornecedorLabel } from '../enums/status-solicitacao-fornecedor';
import { FilterBase } from './filter-base';
  
  export class SolicitacaoCadastroFornecedorFiltro extends FilterBase {
    public razaoSocial: string = "";
    public cnpj: string = "";
    public status: StatusSolicitacaoFornecedor;
  
    private statusLabel = StatusSolicitacaoFornecedorLabel;
  
    set _status(value: any) {
      if (value) this.status = this.getKeyByValue(this.statusLabel, value.label);
      else this.status = null;
    }
  
    get _status(): any {
      return this.statusLabel.get(this.status);
    }
  
    private getKeyByValue(dictionary: Map<number, string>, value): number {
      return Array.from(dictionary.keys()).find(key => dictionary.get(key).valueOf() == value);
    }
  }