import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sdk-tag-read-only',
  templateUrl: './sdk-tag-read-only.component.html',
  styleUrls: ['./sdk-tag-read-only.component.scss']
})
export class SdkTagReadOnlyComponent implements OnInit {
  @Input() titleColor: string = '#00a1d7';
  @Input() subTitleColor: string = '#6E6E72';

  @Input() title: string = '';
  @Input() subTitle: string = '';

  constructor() {}

  ngOnInit() {}
}
