import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sdk-card-entry',
  templateUrl: './sdk-card-entry.component.html',
  styleUrls: ['./sdk-card-entry.component.scss']
})
export class SdkCardEntryComponent implements OnInit {
  @Input() icon: string = 'far fa-file-alt';
  @Input() iconColor: string = '#00BBF3';
  @Input() iconSize: string = 'fa-2x';
  @Input() label: string = 'Documentos Válidos';

  constructor() {}

  ngOnInit() {}
}
