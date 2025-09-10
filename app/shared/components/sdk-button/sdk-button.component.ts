import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-button',
  templateUrl: './sdk-button.component.html',
  styleUrls: ['./sdk-button.component.scss']
})
export class SdkButtonComponent implements OnInit {

  @Input() label: string = '';

  @Input() type:
    | 'primary'
    | 'secondary'
    | 'sucess'
    | 'warning'
    | 'danger'
    | 'info'
    | 'light'
    | 'dark' = 'primary';

  @Input() icon: string = 'fa fa-plus';

  @Input() disabled: boolean;

  @Output() buttonClick: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() { }
}
