import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContaContabilRoutingModule } from './conta-contabil-routing.module';
import { ListarContasContabeisComponent } from './listar-contas-contabeis/listar-contas-contabeis.component';
import { ManterContaContabilComponent } from './manter-conta-contabil/manter-conta-contabil.component';
import { SharedModule } from './../../shared/shared.module';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ContaContabilRoutingModule,
    TreeModule.forRoot()
  ],
  declarations: [ListarContasContabeisComponent, ManterContaContabilComponent]
})
export class ContaContabilModule { }
