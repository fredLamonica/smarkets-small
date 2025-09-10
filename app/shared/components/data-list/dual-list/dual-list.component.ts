import { Component, ContentChildren, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CustomColumnDirective } from '../directives/custom-column.directive';
import { SelectionModeEnum } from '../models/selection-mode.enum';
import { SizeEnum } from '../models/size.enum';
import { TableConfig } from '../table/models/table-config';
import { TableStyleEnum } from '../table/models/table-style.enum';
import { DualListColumn } from './models/dual-list-column';
import { DualListConfig } from './models/dual-list-config';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'smk-dual-list',
  templateUrl: './dual-list.component.html',
  styleUrls: ['./dual-list.component.scss'],
})
export class DualListComponent<T> implements OnInit {
  @ViewChild('sourceSearchInput') sourceSearchInput: ElementRef;
  @ViewChild('destinationSearchInput') destinationSearchInput: ElementRef;

  id: string;
  @Input() config: DualListConfig<T>;
  @Input() source: Array<T>;
  @Input() selected: Array<T>;

  @ContentChildren(CustomColumnDirective) columnTemplates: QueryList<CustomColumnDirective>;
  @Output() readonly selectedChange: EventEmitter<Array<T>> = new EventEmitter<Array<T>>();

  name: string;
  sourceTitle: string;
  destinationTitle: string;
  tableConfig: TableConfig<T>;
  selectedSource: Array<T> = new Array<T>();
  destination: Array<T> = new Array<T>();
  selectedDestination: Array<T> = new Array<T>();
  searchCompareTo: Function;
  sourceSearch: string;
  destinationSearch: string;
  private compareTo: Function;

  constructor() { }

  ngOnInit() {
    this.setupConfig();
    this.setupSelected();
    this.setupSearch();
  }

  selectedSourceChange(selected: Array<T>) {
    this.selectedSource = selected;
  }

  selectedDestinationChange(selected: Array<T>) {
    this.selectedDestination = selected;
  }

  add() {
    this.addToDestination(this.selectedSource);
  }

  addAll() {
    this.addToDestination(this.source);
  }

  remove() {
    this.removeFromDestination(this.selectedDestination);
  }

  removeAll() {
    this.removeFromDestination(this.destination);
  }

  clearSourceSearch() {
    this.sourceSearch = '';
    this.sourceSearchInput.nativeElement.value = '';
  }

  clearDestinationSearch() {
    this.destinationSearch = '';
    this.destinationSearchInput.nativeElement.value = '';
  }

  private setupSearch() {
    fromEvent(this.sourceSearchInput.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(() => this.sourceSearchInput.nativeElement.value),
    ).subscribe((search: string) => this.sourceSearch = search);

    fromEvent(this.destinationSearchInput.nativeElement, 'keyup').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map(() => this.destinationSearchInput.nativeElement.value),
    ).subscribe((search: string) => this.destinationSearch = search);
  }

  private setupConfig() {
    this.name = this.config.name,
    this.sourceTitle = this.config.sourceTitle || 'Não selecionados';
    this.destinationTitle = this.config.destinationTitle || 'Selecionados';
    this.searchCompareTo = this.config.searchCompareTo;
    this.compareTo = this.config.compareTo || ((a, b) => a === b);
    this.tableConfig = new TableConfig<T>({
      size: SizeEnum.Small,
      hideHeader: this.config.columns.length === 1,
      style: TableStyleEnum.None,
      columns: this.config.columns.map((c) => new DualListColumn({ name: c.name, type: c.type })),
      usePagination: false,
      useLocalPagination: false,
      selectionMode: SelectionModeEnum.Multiple,
      emptyStateText: ' ',
    });
  }

  private setupSelected() {
    if (this.selected && this.selected.length) {
      this.addToDestination(this.source.filter((sourceItem) => this.selected.findIndex((selectedItem) => this.compareTo(sourceItem, selectedItem)) !== -1));
    }
  }

  private removeFromDestination(items: Array<T>) {
    this.source = [...this.source, ...items];
    this.destination = this.destination.filter((s) => !items.includes(s));
    this.selectedDestination = [];
    this.selectedChange.emit(this.destination);
  }

  private addToDestination(items: Array<T>) {
    this.destination = [...this.destination, ...items];
    this.source = this.source.filter((s) => !items.includes(s));
    this.selectedSource = [];
    this.selectedChange.emit(this.destination);
  }
}
