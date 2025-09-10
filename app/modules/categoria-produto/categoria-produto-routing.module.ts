import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarCategoriasProdutoComponent } from './listar-categorias-produto/listar-categorias-produto.component';
import { ManterCategoriaProdutoComponent } from './manter-categoria-produto/manter-categoria-produto.component';

const routes: Routes = [
  { path: "", component: ListarCategoriasProdutoComponent },
  { path: "novo", component: ManterCategoriaProdutoComponent },
  { path: ":idCategoria", component: ManterCategoriaProdutoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriaProdutoRoutingModule { }
