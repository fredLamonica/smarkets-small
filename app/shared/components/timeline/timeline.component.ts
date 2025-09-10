import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TimelineItemStatus } from '@models/enums/timeline-item-status.enum';
import { TimelineItem } from '@models/timeline-item';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnChanges {

  @Input() currentIndex = 0;
  @Input() canceled: boolean = false;
  @Input() timeline = new Array<TimelineItem>();
  @Input() classes = '';

  timelineItemStatus = TimelineItemStatus;

  constructor() { }

  ngOnInit() {
    this.changeCurrent();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.changeCurrent();
  }

  private changeCurrent() {
    if (this.timeline) {
      this.timeline.forEach((item, index) => {
        if (item.status === TimelineItemStatus.success) {
          this.currentIndex = index;
        }
      });
    }
  }

}
