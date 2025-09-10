import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { IMenuItem } from '../sdk-menu-item/menu-item';

@Component({
  selector: 'sdk-menu',
  templateUrl: './sdk-menu.component.html',
  styleUrls: ['./sdk-menu.component.scss'],
})
export class SdkMenuComponent implements OnInit, OnChanges {
  @Input() itens: IMenuItem[];
  @Input() showMenu: boolean = true;

  @Input() menuIcon: string;
  @Input() menuIconColor: string;

  @Input() showStatusBar: boolean = true;
  @Input() statusBarColor: string = '';

  @Input() isClickableMenu: boolean = true;
  @Input() isNavigationOn: boolean = true;

  @Output() menuItemClickedEvent = new EventEmitter<any>();
  @Output() menuItemActivated = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.itens) {
      if (!this.isNavigationOn) {
        this.activateMenu(this.itens[0]);
      }
    }
  }

  menuItemClicked(item) {
    if (!item.locked) {
      this.menuItemClickedEvent.emit(item);
    }
  }

  itemClicked(item: IMenuItem) {
    const menuItem = this.itens.find((x) => x.label === item.label);
    this.activateClickedMenu(menuItem);
  }

  private activateClickedMenu(menuItem: IMenuItem) {
    this.inactivateAll();
    this.activateMenu(menuItem);
  }

  private inactivateAll () {
    for (let index = 0; index < this.itens.length; index++) {
      const element = this.itens[index];
      element.isActive = false;
    }
  }

  private activateMenu(menuItem: IMenuItem) {
    menuItem.isActive = true;
    this.menuItemActivated.emit(menuItem);
  }
}
