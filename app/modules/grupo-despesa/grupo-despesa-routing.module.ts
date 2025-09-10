import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManterGrupoDespesaComponent } from './manter-grupo-despesa/manter-grupo-despesa.component';
import { ListarGruposDespesaComponent } from './listar-grupos-despesa/listar-grupos-despesa.component';

const routes: Routes = [
  { path: "", component: ListarGruposDespesaComponent },
  { path: "novo", component: ManterGrupoDespesaComponent },
  { path: ":idGrupo", component: ManterGrupoDespesaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupoDespesaRoutingModule { }
