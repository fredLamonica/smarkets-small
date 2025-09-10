import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { ColumnTypeEnum } from '../../models/column-type.enum';
import { TableColumn } from '../../table/models/table-column';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'smk-column',
  templateUrl: './column.component.html',
  // tslint:disable-next-line: trailing-comma
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {
  @Input() template: TemplateRef<any>;
  @Input() item: any;
  @Input() column: TableColumn;

  ColumnTypeEnum = ColumnTypeEnum;

  constructor() {}

  ngOnInit() {}
}
