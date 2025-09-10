import { Component, Input, OnInit } from '@angular/core';
import { IndicadorCategoriaDto } from '../../../../shared/models/indicador/indicador-categoria-dto';
import { IndicadorTransacoesSkuFast } from '../../../../shared/models/indicador/indicador-transacoes-sku-fast';

@Component({
  selector: 'smk-dashboard-transaction-fast',
  templateUrl: './dashboard-transaction-fast.component.html',
  styleUrls: ['./dashboard-transaction-fast.component.scss']
})
export class DashboardTransactionFastComponent implements OnInit {

  @Input() IndicadorTransacoesSkuFast: IndicadorTransacoesSkuFast;
  @Input() IndicadorCategoriasDto: IndicadorCategoriaDto;
  @Input() IsLoading: boolean;
  @Input() IsLoadingCategoria: boolean;

  constructor() { }

  ngOnInit() {
  }

}
