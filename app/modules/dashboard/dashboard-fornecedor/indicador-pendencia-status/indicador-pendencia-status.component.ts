import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'indicador-pendencia-status',
  templateUrl: './indicador-pendencia-status.component.html',
  styleUrls: ['./indicador-pendencia-status.component.scss']
})
export class IndicadorPendenciaStatusComponent implements OnInit {
  @Input() value: number;
  @Input() label: string;
  @Input() color: string = '#66CFF6';
  @Output() event = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  public onClick() {
    this.event.emit();
  }
}
