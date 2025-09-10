import { ColumnTypeEnum } from '../components/data-list/models/column-type.enum';

export class ConfiguracaoColunaDto {

  coluna: string;
  label: string;
  tipo: ColumnTypeEnum;

  constructor(init?: Partial<ConfiguracaoColunaDto>) {
    Object.assign(this, init);
  }

}
