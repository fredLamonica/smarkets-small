import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParametrosIntegracaoComponent } from './parametros-integracao/parametros-integracao.component';

const routes: Routes = [
  { path: "", component: ParametrosIntegracaoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosIntegracaoRoutingModule { }
