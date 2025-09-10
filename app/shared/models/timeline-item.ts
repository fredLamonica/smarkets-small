import { TimelineItemStatus } from './enums/timeline-item-status.enum';

export class TimelineItem {
  iconClass: string;
  title: string;
  status?: TimelineItemStatus;

  constructor(init?: Partial<TimelineItem>) {
    Object.assign(this, init);
  }
}
