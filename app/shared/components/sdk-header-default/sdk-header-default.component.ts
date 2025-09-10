import { Component, Input, OnInit } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'sdk-header-default',
  templateUrl: './sdk-header-default.component.html',
  styleUrls: ['./sdk-header-default.component.scss'],
})
export class SdkHeaderDefaultComponent implements OnInit {
  @Input() topValue: string = '80px';
  @Input() heightValue: string = '64px';
  @Input() colorBackground: string = '#ffffff';
  @Input() showShadow: boolean = false;
  @Input() heightAuto: boolean = false;
  @Input() padding: string = '';

  constructor() { }

  ngOnInit() { }
}
