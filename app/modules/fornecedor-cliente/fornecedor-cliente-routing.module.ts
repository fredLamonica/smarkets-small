import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarFornecedorClientesComponent } from './listar-fornecedor-clientes/listar-fornecedor-clientes.component';
import { ManterFornecedorClienteComponent } from './manter-fornecedor-cliente/manter-fornecedor-cliente.component';

const routes: Routes = [
  { path: "", component: ListarFornecedorClientesComponent },
  { path: ":idPessoaJuridica", component: ManterFornecedorClienteComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FornecedorClienteRoutingModule { }
