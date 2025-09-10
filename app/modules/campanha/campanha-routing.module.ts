import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarCampanhasComponent } from './listar-campanhas/listar-campanhas.component';
import { ManterCampanhaComponent } from './manter-campanha/manter-campanha.component';

const routes: Routes = [
  { path: "", component: ListarCampanhasComponent },
  { path: "novo", component: ManterCampanhaComponent },
  { path: ":idCampanha", component: ManterCampanhaComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampanhaRoutingModule { }
