import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'sdk-select',
  templateUrl: './sdk-select.component.html',
  styleUrls: ['./sdk-select.component.scss']
})
export class SdkSelectComponent implements OnInit {
  @Input() placeHolder: string;
  @Input() class: string;
  @Input() items: Array<any>;
  @Input() IsMultiple = false;
  @Output() event = new EventEmitter();
  public selected = [];
  constructor() {}

  ngOnInit() {}

  public showSelection() {
    if(this.selected){
      this.event.emit(this.selected);
    }else{
      this.event.emit([]);
    }
  }
}
