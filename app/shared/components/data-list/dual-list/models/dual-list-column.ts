import { ColumnTypeEnum } from '../../models/column-type.enum';

export class DualListColumn {
  name: string;
  title: string;
  type: ColumnTypeEnum;
  constructor(init?: Partial<DualListColumn>) {
    Object.assign(this, init);
  }
}
