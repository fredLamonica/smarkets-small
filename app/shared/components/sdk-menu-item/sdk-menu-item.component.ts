import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMenuItem } from './menu-item';

@Component({
  selector: 'sdk-menu-item',
  templateUrl: './sdk-menu-item.component.html',
  styleUrls: ['./sdk-menu-item.component.scss'],
})
export class SdkMenuItemComponent implements OnInit {
  @Input() item: IMenuItem;

  @Input() isNavigationOn = false;

  @Output() itemClicked = new EventEmitter<any>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onClick = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  menuItemClicked(item: IMenuItem) {
    if (!item.locked) {
      this.onClick.emit(item);
    }
  }

  onClickMenuItem(item: IMenuItem) {
    if (!item.locked) {
      this.itemClicked.emit(item);
    }
  }
}
