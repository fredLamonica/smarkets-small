import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManterContratoCatalogoComponent } from './manter-contrato-catalogo/manter-contrato-catalogo.component';
import { ListarContratosCatalogoComponent } from './listar-contratos-catalogo/listar-contratos-catalogo.component';

const routes: Routes = [
  { path: "", component: ListarContratosCatalogoComponent },
  { path: "novo", component: ManterContratoCatalogoComponent },
  { path: ":idContrato", component: ManterContratoCatalogoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContratoCatalogoRoutingModule { }
