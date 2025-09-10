import { Component, ContentChildren, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, TemplateRef } from '@angular/core';
import { Guid } from '../../../utils/guid';
import { CustomColumnDirective } from '../directives/custom-column.directive';
import { SelectionModeEnum } from '../models/selection-mode.enum';
import { SizeEnum } from '../models/size.enum';
import { TableColumn } from './models/table-column';
import { TableConfig } from './models/table-config';
import { TablePagination } from './models/table-pagination';
import { TableStyleEnum } from './models/table-style.enum';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'smk-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, OnChanges {
  @ContentChildren(CustomColumnDirective) columnTemplates: QueryList<CustomColumnDirective>;

  @Input() config: TableConfig<T>;
  @Input() items: Array<T & { selected: boolean, relateds: Array<T & { selected: boolean }> }>;
  @Output() readonly selectedChange: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();
  @Output() readonly pageChange: EventEmitter<TablePagination> = new EventEmitter<TablePagination>();

  SelectionModeEnum = SelectionModeEnum;
  SizeEnum = SizeEnum;
  TableStyleEnum = TableStyleEnum;

  id: string;
  columns: Array<TableColumn>;
  pagedItems: Array<T & { selected: boolean }> = new Array<T & { selected: boolean }>();
  page: number;
  totalItems: number;
  totalPages: number;
  usePagination: boolean;
  pageSize: number;
  hideHeader: boolean;
  empty: boolean;
  emptyStateText: string;
  size: SizeEnum;
  style: TableStyleEnum;
  selectionMode: SelectionModeEnum;
  tableHover: boolean;
  tableBordered: boolean;
  highlightSelected: boolean;

  private useLocalPagination: boolean;

  constructor() { }

  ngOnInit() {
    this.id = new Guid().toString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.config) {
      this.setupConfig();
    } else if (changes.items) {
      this.setupItems();
    }
  }

  getTemplate(columnName: string): TemplateRef<CustomColumnDirective> {
    const template = this.columnTemplates
      ? this.columnTemplates.toArray().find((tmp: CustomColumnDirective) => tmp.customColumn === columnName)
      : null;

    if (!!template) {
      return template.templateRef;
    }

    return undefined;
  }

  toggle(index: string) {
    if (this.selectionMode === SelectionModeEnum.Single) {
      this.clearSelection(false);

      if (this.useLocalPagination) {
        this.items.map((item) => (item.selected = false));
      }
    }

    this.pagedItems[index].selected = !this.pagedItems[index].selected;

    if (this.pagedItems[index].relateds && this.pagedItems[index].relateds.length > 0) {
      this.pagedItems[index].relateds.forEach((item) => {
        item.selected = !item.selected;
      });
    }

    this.emitSelected();
  }

  toggleAll() {
    if (this.isAllSelected()) {
      this.clearSelection(false);
    } else {
      this.selectAll();
    }

    this.emitSelected();
  }

  setPage(pagination: any) {
    this.clearSelection(true);

    this.page = pagination.page;
    this.pageSize = pagination.recordsPerPage;

    if (this.useLocalPagination) {
      this.totalPages = Math.floor((this.totalItems + this.pageSize - 1) / this.pageSize);
      this.pagedItems = this.paginate(this.items, this.pageSize, this.page);
    }

    this.pageChange.emit(new TablePagination({ page: this.page, pageSize: this.pageSize }));
  }

  isAllSelected(): boolean {
    return this.pagedItems.length && this.pagedItems.findIndex((item) => !item.selected) === -1;
  }

  emptyStateColspan(): number {
    let colspan = this.columns.length;

    if (this.selectionMode !== SelectionModeEnum.None) {
      colspan++;
    }

    return colspan;
  }

  reconstruaTable(itens: T[]) {
    this.items = itens as Array<T & { selected: boolean, relateds: Array<T & { selected: boolean }> }>;
    this.setupItems();
  }

  private emitSelected() {
    const selected = this.pagedItems.filter((item) => item.selected);
    this.selectedChange.emit(selected as Array<T>);
  }

  private clearSelection(emitSelected: boolean) {
    this.pagedItems.map((item) => (item.selected = false));

    if (emitSelected) {
      this.emitSelected();
    }
  }

  private selectAll() {
    this.pagedItems.map((item) => (item.selected = true));
  }

  private paginate(items: any[], pageSize: number, page: number) {
    return items.slice((page - 1) * pageSize, page * pageSize);
  }

  private setupItems() {
    if (!this.items || !this.items.length) {
      this.empty = true;
    } else {
      this.empty = false;

      this.items = this.items.map((item) => {
        item.selected = false;
        return item;
      });

      if (this.useLocalPagination) {
        this.totalItems = this.items.length;
        this.setPage({ page: this.page, recordsPerPage: this.pageSize });
      } else {
        this.pagedItems = this.items;
      }
    }
  }

  private setupConfig() {
    this.columns = this.config.columns;
    this.useLocalPagination = this.config.useLocalPagination;
    this.usePagination = this.config.usePagination || this.config.useLocalPagination;
    this.page = this.config.page || 1;
    this.hideHeader = this.config.hideHeader;
    this.style = this.config.style || TableStyleEnum.Striped;
    this.size = this.config.size;
    this.selectionMode = this.config.selectionMode || SelectionModeEnum.None;
    this.emptyStateText = this.config.emptyStateText || 'Nenhum registro disponível.';
    this.tableHover = this.config.tableHover;
    this.tableBordered = this.config.tableBordered;
    this.highlightSelected = this.config.highlightSelected;

    if (!this.useLocalPagination) {
      this.totalItems = this.config.totalItems;
      this.totalPages = this.config.totalPages;
    }

    if (this.usePagination) {
      this.pageSize = this.config.pageSize || 5;
    } else {
      this.pageSize = this.totalItems;
    }

    this.setupItems();
  }
}
