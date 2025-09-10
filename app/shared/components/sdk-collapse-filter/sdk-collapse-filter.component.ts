import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sdk-collapse-filter',
  templateUrl: './sdk-collapse-filter.component.html',
  styleUrls: ['./sdk-collapse-filter.component.scss']
})
export class SdkCollapseFilterComponent implements OnInit {
  @Input() aditionalButtonLabel: string = '';
  @Input() aditionalButtonIcon: string = 'fas fa-plus';
  @Output() aditionalButtonEvent: EventEmitter<any> = new EventEmitter();
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();
  detailedSearch: boolean = false;

  constructor() {}

  ngOnInit() {}
  showDetailedSearch(event: boolean) {
    this.detailedSearch = event;
  }

  aditionalButtonClick() {
    this.aditionalButtonEvent.emit();
  }

  searchClick() {
    this.searchEvent.emit();
  }
}
