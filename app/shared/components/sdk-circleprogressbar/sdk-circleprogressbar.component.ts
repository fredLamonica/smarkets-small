import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sdk-circleprogressbar',
  templateUrl: './sdk-circleprogressbar.component.html',
  styleUrls: ['./sdk-circleprogressbar.component.scss']
})
export class SdkCircleprogressbarComponent implements OnInit {
  constructor() {}

  @Input() value: number;
  @Input() maxValue: number;
  @Input() title: string = '';

  // Region Config
  @Input() progressColor: string = '#78C000';
  @Input() radius: number = 55;
  @Input() stroke: number = 10;
  @Input() showSubtitle: boolean = true;
  @Input() subtitle: string = '';
  @Input() titleFontSize: number = 20;
  @Input() titleFontWeight: number = 500;

  @Input() percent: number = 0;

  @Input() titleClass: string = 'title';
  @Input() subTitleClass: string = 'subtitle';

  // END Region Config

  ngOnInit() {
    this.percent = (this.value / this.maxValue) * 100;
  }
}
