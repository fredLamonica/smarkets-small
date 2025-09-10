import {
  Component,
  ContentChild,
  Input,
  OnInit,
  Output,
  TemplateRef,
  EventEmitter
} from '@angular/core';
import { SdkListViewItem } from './skd-list-view-item.directive';

@Component({
  selector: 'sdk-list-view',
  templateUrl: './sdk-list-view.component.html',
  styleUrls: ['./sdk-list-view.component.scss']
})
export class SdkListViewComponent implements OnInit {
  @Input() items: any[];

  @Output() itemClick = new EventEmitter<any>();

  @ContentChild(SdkListViewItem, { read: TemplateRef }) listItemTemplate;

  public internalItemClick(item: any) {
    this.itemClick.emit(item);
  }

  constructor() {}

  ngOnInit() {}
}
