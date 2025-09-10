import { Component, Input, OnInit } from '@angular/core';
import { IndicadorUsuarioFast } from '../../../../shared/models/indicador/indicador-usuario-fast';

@Component({
  selector: 'smk-dashboard-usuario-fast',
  templateUrl: './dashboard-usuario-fast.component.html',
  styleUrls: ['./dashboard-usuario-fast.component.scss']
})
export class DashboardUsuarioFastComponent implements OnInit {

  @Input() IndicadorUsuarioFast: IndicadorUsuarioFast;
  @Input() IsLoading: boolean;
  constructor() { }

  ngOnInit() {
  }

}
