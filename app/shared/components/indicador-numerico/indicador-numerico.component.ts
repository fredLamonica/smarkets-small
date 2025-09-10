import { Component, OnInit, Input } from '@angular/core';
import { Indicador } from '@shared/models';

@Component({
  selector: 'indicador-numerico',
  templateUrl: './indicador-numerico.component.html',
  styleUrls: ['./indicador-numerico.component.scss']
})
export class IndicadorNumericoComponent implements OnInit {

  @Input() indicador: Indicador;

  constructor() { }

  ngOnInit() {
  }

}
