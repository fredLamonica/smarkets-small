import { ManterCondicaoPagamentoComponent } from './manter-condicao-pagamento/manter-condicao-pagamento.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarCondicoesPagamentoComponent } from './listar-condicoes-pagamento/listar-condicoes-pagamento.component';

const routes: Routes = [
  { path: "", component: ListarCondicoesPagamentoComponent },
  { path: "novo", component: ManterCondicaoPagamentoComponent },
  { path: ":idCondicaoPagamento", component: ManterCondicaoPagamentoComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CondicaoPagamentoRoutingModule { }
