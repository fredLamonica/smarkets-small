import { SortDirectionEnum } from '../../models/sort-direction.enum';

export class TableColumnSort {
  column: string;
  direcion: SortDirectionEnum;
  constructor(init?: Partial<TableColumnSort>) {
    Object.assign(this, init);
  }
}
