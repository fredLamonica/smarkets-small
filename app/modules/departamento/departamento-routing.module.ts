import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarDepartamentosComponent } from './listar-departamentos/listar-departamentos.component';
import { ManterDepartamentoComponent } from './manter-departamento/manter-departamento.component';

const routes: Routes = [
  { path: "", component: ListarDepartamentosComponent },
  { path: "novo", component: ManterDepartamentoComponent },
  { path: ":idDepartamento", component: ManterDepartamentoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartamentoRoutingModule { }
