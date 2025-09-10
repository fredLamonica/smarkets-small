import { ColumnTypeEnum } from '../../models/column-type.enum';

export class TableColumn {
  name: string;
  title: string;
  type: ColumnTypeEnum;

  constructor(init?: Partial<TableColumn>) {
    Object.assign(this, init);
  }
}
