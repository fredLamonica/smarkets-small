import { ListarDocumentosFornecedorComponent } from './documentos-fornecedor/listar-documentos-fornecedor/listar-documentos-fornecedor.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: "dados", component: ListarDocumentosFornecedorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DadosFornecedorRoutingModule { }
