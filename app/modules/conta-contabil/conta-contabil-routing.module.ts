import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarContasContabeisComponent } from './listar-contas-contabeis/listar-contas-contabeis.component';
import { ManterContaContabilComponent } from './manter-conta-contabil/manter-conta-contabil.component';

const routes: Routes = [
  { path: "", component: ListarContasContabeisComponent },
  { path: "novo", component: ManterContaContabilComponent },
  { path: ":idConta", component: ManterContaContabilComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContaContabilRoutingModule { }
