import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'indicador-documento',
  templateUrl: './indicador-documento.component.html',
  styleUrls: ['./indicador-documento.component.scss']
})
export class IndicadorDocumentoComponent implements OnInit {
  @Input() value: number;
  @Input() maxValue: number;
  @Input() color: string;
  @Input() label: string;

  constructor() {}

  ngOnInit() {}
}
