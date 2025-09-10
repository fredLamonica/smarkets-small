import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarNaturezasJuridicasComponent } from './listar-naturezas-juridicas/listar-naturezas-juridicas.component';
import { ManterNaturezaJuridicaComponent } from './manter-natureza-juridica/manter-natureza-juridica.component';

const routes: Routes = [
  { path: "", component: ListarNaturezasJuridicasComponent },
  { path: "novo", component: ManterNaturezaJuridicaComponent },
  { path: ":idNaturezaJuridica", component: ManterNaturezaJuridicaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NaturezaJuridicaRoutingModule { }
