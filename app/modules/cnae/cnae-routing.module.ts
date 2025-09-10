import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarCnaesComponent } from './listar-cnaes/listar-cnaes.component';

const routes: Routes = [
  { path: "", component: ListarCnaesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CnaeRoutingModule { }
