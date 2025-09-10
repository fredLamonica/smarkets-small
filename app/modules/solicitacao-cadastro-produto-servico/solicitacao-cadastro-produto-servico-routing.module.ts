import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarSlaComponent } from './listar-sla/listar-sla.component';

const routes: Routes = [
  { path: "", component: ListarSlaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoCadastroProdutoServicoRoutingModule { }
