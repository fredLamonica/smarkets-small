import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrarInteresseComponent } from './registrar-interesse/registrar-interesse.component';

const routes: Routes = [
  { path: ":url", component: RegistrarInteresseComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorInteressadoRoutingModule { }
