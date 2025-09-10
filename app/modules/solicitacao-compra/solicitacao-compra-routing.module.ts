import { ImportacaoSolicitacaoCompra } from './../../shared/models/importacao-solicitacao-compra';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManterSolicitacaoCompraComponent } from './manter-solicitacao-compra/manter-solicitacao-compra.component';

const routes: Routes = [
  {
    path: 'importacao',
    component: ImportacaoSolicitacaoCompra
  },
  { path: ':idSolicitacaoCompra', component: ManterSolicitacaoCompraComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoCompraRoutingModule {}
