import { SelectionModeEnum } from '../../models/selection-mode.enum';
import { SizeEnum } from '../../models/size.enum';
import { TableColumn } from './table-column';
import { TableStyleEnum } from './table-style.enum';

export class TableConfig<T> {
  size: SizeEnum.Small | SizeEnum.Regular;
  columns: TableColumn[];
  usePagination: boolean;
  hideHeader: boolean;
  emptyStateText: string;
  style: TableStyleEnum;
  useLocalPagination: boolean;
  page: number;
  pageSize: number;
  selectionMode: SelectionModeEnum;
  totalPages: number;
  totalItems: number;
  tableHover: boolean;
  tableBordered: boolean;
  highlightSelected: boolean;

  constructor(init?: Partial<TableConfig<T>>) {
    Object.assign(this, init);
  }
}
