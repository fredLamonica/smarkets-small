import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-rectangle-button',
  templateUrl: './sdk-rectangle-button.component.html',
  styleUrls: ['./sdk-rectangle-button.component.scss']
})
export class SdkRectangleButtonComponent implements OnInit {
  constructor() {}

  @Input() leftIconClass: string = '';
  @Input() leftIconColor: string = '';

  @Input() label: string = '';
  @Input() type:
    | 'none'
    | 'primary'
    | 'secondary'
    | 'sucess'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark' = 'none';
  @Output() buttonClick: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}
}
