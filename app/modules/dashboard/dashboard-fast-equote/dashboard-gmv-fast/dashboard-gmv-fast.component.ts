import { Component, Input, OnInit } from '@angular/core';
import { IndicadorGmvFast } from '../../../../shared/models/indicador/indicador-gmv-fast';

@Component({
  selector: 'smk-dashboard-gmv-fast',
  templateUrl: './dashboard-gmv-fast.component.html',
  styleUrls: ['./dashboard-gmv-fast.component.scss']
})
export class DashboardGmvFastComponent implements OnInit {

  @Input() IndicadorGmvFast: IndicadorGmvFast;
  @Input() IsLoading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
