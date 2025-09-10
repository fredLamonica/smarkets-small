import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from './../../../shared/shared.module';
import { DashboardFornecedorComponent } from './dashboard-fornecedor.component';
import { DashboardFornecedorCategoriaComponent } from './dashboard-fornecedor-categoria/dashboard-fornecedor-categoria.component';
import { DashboardFornecedorStatusComponent } from './dashboard-fornecedor-status/dashboard-fornecedor-status.component';
import { IndicadorDocumentoComponent } from './indicador-documento/indicador-documento.component';
import { IndicadorPendenciaStatusComponent } from './indicador-pendencia-status/indicador-pendencia-status.component';

@NgModule({
  declarations: [
    DashboardFornecedorComponent,
    DashboardFornecedorCategoriaComponent,
    DashboardFornecedorStatusComponent,
    IndicadorDocumentoComponent,
    IndicadorPendenciaStatusComponent
  ],
  imports: [CommonModule, SharedModule],
  exports: [DashboardFornecedorComponent]
})
export class DashboardFornecedorModule {}
