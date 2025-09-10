import { Situacao } from '../enums/situacao';
import { FilterBase } from './filter-base';

export class AlcadaFiltro extends FilterBase {
  descricao: string;
  codigo: string;
  status: Situacao;

  private statusLabel = new Map<number, string>([
    [Situacao.Ativo, 'Ativa'],
    [Situacao.Inativo, 'Inativa'],
  ]);

  set _status(value: any) {
    if (value) {
      this.status = this.getKeyByValue(this.statusLabel, value.label);
    } else {
      this.status = null;
    }
  }

  get _status(): any {
    return this.statusLabel.get(this.status);
  }

  private getKeyByValue(dictionary: Map<number, string>, value: any): number {
    return Array.from(dictionary.keys()).find((key) => dictionary.get(key).valueOf() === value);
  }
}
