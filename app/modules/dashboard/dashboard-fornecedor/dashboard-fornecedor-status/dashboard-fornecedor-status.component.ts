import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-fornecedor-status',
  templateUrl: './dashboard-fornecedor-status.component.html',
  styleUrls: ['./dashboard-fornecedor-status.component.scss']
})
export class DashboardFornecedorStatusComponent implements OnInit {
  @Input() fornecedoresInteressados: number;
  @Input() fornecedoresNaoHomologados: number;
  @Input() fornecedoresHomologados: number;
  @Input() totalFornecedores: number;

  constructor() {}

  ngOnInit() {}
}
