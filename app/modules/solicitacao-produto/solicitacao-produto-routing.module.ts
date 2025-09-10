import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarSolicitacaoProdutoComponent } from './listar-solicitacao-produto/listar-solicitacao-produto.component';

const routes: Routes = [
  { path: "", component: ListarSolicitacaoProdutoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SolicitacaoProdutoRoutingModule { }
