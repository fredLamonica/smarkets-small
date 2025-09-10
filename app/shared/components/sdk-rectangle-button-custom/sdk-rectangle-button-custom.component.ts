import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-rectangle-button-custom',
  templateUrl: './sdk-rectangle-button-custom.component.html',
  styleUrls: ['./sdk-rectangle-button-custom.component.scss']
})
export class SdkRectangleButtonCustomComponent implements OnInit {
  constructor() {}

  @Input() leftIconClass: string = '';
  @Input() leftIconColor: string = '';

  @Input() label: string = '';
  @Input() colorText: string = '#ffffff';
  @Input() colorBackground: string = '#cfd8dc';

  @Output() buttonClick: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}
}
