import {
  SituacaoPessoaJuridica,
  SituacaoPessoaJuridicaLabel
} from '../enums/situacao-pessoa-juridica';
import { FilterBase } from './filter-base';

export class BuyerFilter extends FilterBase {
  public razaoSocial: string;
  public cnpj: string;
  public situacao?: SituacaoPessoaJuridica;
  public codigoEmpresa: string;

  private situacaoLabel = SituacaoPessoaJuridicaLabel;

  set _status(value: any) {
    if (value) this.situacao = this.getKeyByValue(this.situacaoLabel, value.label);
    else this.situacao = null;
  }

  get _status(): any {
    return this.situacaoLabel.get(this.situacao);
  }

  private getKeyByValue(dictionary: Map<number, string>, value): number {
    return Array.from(dictionary.keys()).find(key => dictionary.get(key).valueOf() == value);
  }
}
