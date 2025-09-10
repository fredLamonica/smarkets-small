import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarImportacaoContratoSellerComponent } from './listar-importacao-catalogo-seller/listar-importacao-catalogo-seller';
import { ManterContratoFornecedorComponent } from './manter-contrato-fornecedor/manter-contrato-fornecedor.component';
import { ProdutosCatalogoFornecedorComponent } from './produtos-catalogo-fornecedor.component';

const routes: Routes = [
  { path: '', component: ProdutosCatalogoFornecedorComponent },
  { path: 'historico', component: ListarImportacaoContratoSellerComponent },
  { path: ':idContrato', component: ManterContratoFornecedorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutosCatalogoFornecedorRoutingModule { }
