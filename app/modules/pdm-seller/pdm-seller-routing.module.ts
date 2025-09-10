import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeCategoriasComponent } from './liste-categorias/liste-categorias.component';
import { ListeProdutosComponent } from './liste-produtos/liste-produtos.component';

const routes: Routes = [
  { path: '', component: ListeCategoriasComponent},
  { path: ':idCategoriaProduto/:idTenant', component: ListeProdutosComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PdmSellerRoutingModule { }
