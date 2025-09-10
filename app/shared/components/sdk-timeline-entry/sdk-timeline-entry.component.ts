import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sdk-timeline-entry',
  templateUrl: './sdk-timeline-entry.component.html',
  styleUrls: ['./sdk-timeline-entry.component.scss']
})
export class SdkTimelineEntryComponent implements OnInit {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() showTitle: boolean = true;
  @Input('sub-title') subtitle: string = '';

  constructor() {}

  ngOnInit() {}
}
