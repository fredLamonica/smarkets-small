import { Component, Input, OnInit } from '@angular/core';
import { IndicadorFornecedorHomologadoCategoriaDto } from '@shared/models/indicador/indicadores-fornecedor-homologado-categoria';

@Component({
  selector: 'dashboard-fornecedor-categoria',
  templateUrl: './dashboard-fornecedor-categoria.component.html',
  styleUrls: ['./dashboard-fornecedor-categoria.component.scss']
})
export class DashboardFornecedorCategoriaComponent implements OnInit {
  constructor() {}

  @Input() indicadorFornecedorHomologadoCategoria: IndicadorFornecedorHomologadoCategoriaDto[];
  @Input() totalFornecedoresHomologadosComCategoria: number;

  ngOnInit() {}
}
