import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotIsSmarketsGuard } from '../../shared/guards/not-is-smarkets.guard';
import { PermissaoGuard } from '../../shared/guards/permissao.guard';
import { PerfilUsuario } from '../../shared/models';
import { ListarProdutosEmpresaBaseComponent } from './listar-produtos-empresa-base/listar-produtos-empresa-base.component';
import { ListarProdutosComponent } from './listar-produtos/listar-produtos.component';
import { ManterProdutoComponent } from './manter-produto/manter-produto.component';

const routes: Routes = [
  { path: '', component: ListarProdutosComponent },
  { path: 'novo', component: ManterProdutoComponent },
  {
    path: 'base',
    component: ListarProdutosEmpresaBaseComponent,
    canActivate: [PermissaoGuard, NotIsSmarketsGuard],
    data: {
      permissoes: [
        PerfilUsuario.Gestor,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  { path: ':idProduto', component: ManterProdutoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdutoRoutingModule { }
