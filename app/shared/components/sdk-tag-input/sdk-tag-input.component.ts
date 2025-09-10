import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-tag-input',
  templateUrl: './sdk-tag-input.component.html',
  styleUrls: ['./sdk-tag-input.component.scss']
})
export class SdkTagInputComponent implements OnInit {
  @Input() tag: any;
  @Input() tagLabel: string;
  @Input() tagKey: string;
  @Input() tagStyle: string = '';

  @Input() leftIconClass: string = '';

  @Input() rightIconStyle: string = '';
  @Input() hasRightIcon: boolean = false;
  @Input() rightIconClass: string = 'fas fa-times';

  @Input() isClickableTagInput: boolean = false;

  @Input() shadow: boolean = false;

  @Output() taginputClick = new EventEmitter();
  @Output() rightIconClick = new EventEmitter();

  public isSelected: boolean = false;

  constructor() {}

  ngOnInit() {}

  public onTaginputClick() {
    if (this.taginputClick && this.isClickableTagInput) {
      this.isSelected = !this.isSelected;
      this.taginputClick.emit(this.tag);
    }
  }

  public onRightIconClick() {
    if (this.rightIconClick) {
      this.rightIconClick.emit(this.tagKey);
    }
  }

  public getLabel() {
    if (this.tag) {
      return this.tag[this.tagLabel];
    }
    return this.tagLabel;
  }
}
