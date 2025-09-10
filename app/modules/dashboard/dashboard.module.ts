import { DashboardFornecedorComponent } from './dashboard-fornecedor/dashboard-fornecedor.component';
import { DashboardFornecedorModule } from './dashboard-fornecedor/dashboard-fornecedor.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardAprovadorComponent } from './dashboard-aprovador/dashboard-aprovador.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardGestorComponent } from './dashboard-gestor/dashboard-gestor.component';
import { AceiteTermosComponent } from 'src/app/modules/dashboard/aceite-termos/aceite-termos.component';
import { DashboardPadraoComponent } from './dashboard-gestor/dashboard-padrao/dashboard-padrao.component';
import { DashboardIntegracaoComponent } from './dashboard-gestor/dashboard-integracao/dashboard-integracao.component';
import { DashboardFastEquoteComponent } from './dashboard-fast-equote/dashboard-fast-equote.component';
import { DashboardGmvFastComponent } from './dashboard-fast-equote/dashboard-gmv-fast/dashboard-gmv-fast.component';
import { DashboardUsuarioFastComponent } from './dashboard-fast-equote/dashboard-usuario-fast/dashboard-usuario-fast.component';
import { DashboardFornecedorFastComponent } from './dashboard-fast-equote/dashboard-fornecedor-fast/dashboard-fornecedor-fast.component';
import { DashboardTransactionFastComponent } from './dashboard-fast-equote/dashboard-transaction-fast/dashboard-transaction-fast.component';

@NgModule({
  imports: [CommonModule, SharedModule, DashboardRoutingModule, DashboardFornecedorModule],
  declarations: [DashboardComponent, DashboardAprovadorComponent, DashboardGestorComponent, DashboardPadraoComponent, DashboardIntegracaoComponent, DashboardFastEquoteComponent, DashboardGmvFastComponent, DashboardUsuarioFastComponent, DashboardFornecedorFastComponent, DashboardTransactionFastComponent],
  entryComponents: [DashboardAprovadorComponent, DashboardGestorComponent, AceiteTermosComponent]
})
export class DashboardModule {}
