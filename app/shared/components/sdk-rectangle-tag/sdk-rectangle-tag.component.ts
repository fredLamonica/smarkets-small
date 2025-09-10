import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-rectangle-tag',
  templateUrl: './sdk-rectangle-tag.component.html',
  styleUrls: ['./sdk-rectangle-tag.component.scss']
})
export class SdkRectangleTagComponent implements OnInit {
  @Input() tagLabel: string;
  @Input() tagValues: Array<string>;
  @Input() tagKey: string;
  @Input() tagStyle: string = '';

  @Input() leftIconClass: string = '';

  @Input() rightIconStyle: string = '';
  @Input() hasRightIcon: boolean = false;
  @Input() rightIconClass: string = 'fas fa-times';

  @Input() isClickableTagInput: boolean = false;

  @Input() type: 'primary' | 'danger' | 'danger-fixed' = 'primary';
  @Output() removeAllTagsEvent = new EventEmitter();
  @Output() removeTagEvent = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public removeAllTags() {
    if (this.removeAllTagsEvent && this.isClickableTagInput) {
      this.removeAllTagsEvent.emit();
    }
  }

  public removeTag() {
    if (this.removeTagEvent) {
      this.removeTagEvent.emit(this.tagKey);
    }
  }
}
