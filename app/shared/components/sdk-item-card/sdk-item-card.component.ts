import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sdk-item-card',
  templateUrl: './sdk-item-card.component.html',
  styleUrls: ['./sdk-item-card.component.scss'],
})
export class SdkItemCardComponent {
  @Input() showStatusBar: boolean = true;
  @Input() showIconSpot: boolean = true;
  @Input() showIcon: boolean = true;
  @Input() hasMarginBottom: boolean = true;
  @Input() isNested: boolean = false;
  @Input() isFirstNestingItem: boolean = false;
  @Input() isLastNestingItem: boolean = false;
  @Input() statusBarColor: string = '#B8CAD1';
  @Input() iconSpotColor: string = '#B8CAD1';
  @Input() iconSpotColorHover: string = '';
  @Input() iconClass: string = '';
  @Input() borderColor: string = '';
  @Input() borderStyle: string = '';
  @Input() borderWidth: string = '';
  @Output() clickEmitter: EventEmitter<any> = new EventEmitter();
  @Input() borderColorHover: string;
  @Input() repositionOnHover: boolean = false;
  @Input() disabled: boolean = false;

  isHover = false;
  constructor() { }

  onClick() {
    this.clickEmitter.emit();
  }

  onHover() {
    if (this.borderColorHover) {
      this.isHover = !this.disabled;
    }
  }
}
