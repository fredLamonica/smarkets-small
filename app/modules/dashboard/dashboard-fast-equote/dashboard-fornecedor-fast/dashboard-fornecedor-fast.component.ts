import { Component, Input, OnInit } from '@angular/core';
import { IndicadorFornecedorFast } from '../../../../shared/models/indicador/indicador-fornecedor-fast';

@Component({
  selector: 'smk-dashboard-fornecedor-fast',
  templateUrl: './dashboard-fornecedor-fast.component.html',
  styleUrls: ['./dashboard-fornecedor-fast.component.scss']
})
export class DashboardFornecedorFastComponent implements OnInit {

  @Input() IndicadorFornecedorFast: IndicadorFornecedorFast;
  @Input() IsLoading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
