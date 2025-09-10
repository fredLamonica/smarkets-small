import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarCentrosCustoComponent } from './listar-centros-custo/listar-centros-custo.component';
import { ManterCentroCustoComponent } from './manter-centro-custo/manter-centro-custo.component';

const routes: Routes = [
  { path: "", component: ListarCentrosCustoComponent },
  { path: "novo", component: ManterCentroCustoComponent },
  { path: ":idCentroCusto", component: ManterCentroCustoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CentroCustoRoutingModule { }
