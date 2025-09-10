import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoGuard } from '../../shared/guards/permissao.guard';
import { PerfilUsuario } from '../../shared/models';
import { ConfiguracoesPedidoComponent } from './configuracoes-pedido/configuracoes-pedido.component';
import { ListarCriteriosAvaliacaoComponent } from './configuracoes-pedido/configuracoes/criterio-avaliacao-pedido/listar-criterios-avaliacao/listar-criterios-avaliacao.component';
import { ListarPedidosComponent } from './listar-pedidos/listar-pedidos.component';
import { ManterPedidoComponent } from './manter-pedido/manter-pedido.component';

const routes: Routes = [
  {
    path: 'requisicoes-erp',
    component: ListarPedidosComponent,
    canActivate: [PermissaoGuard],
    data: {
      integracaoRequisicaoErp: true,
      permissoes: [PerfilUsuario.Gestor, PerfilUsuario.Requisitante, PerfilUsuario.Comprador],
    },
  },
  {
    path: 'requisicoes-erp/:idRequisicao',
    component: ManterPedidoComponent,
    canActivate: [PermissaoGuard],
    data: {
      integracaoRequisicaoErp: true,
      permissoes: [PerfilUsuario.Gestor, PerfilUsuario.Requisitante, PerfilUsuario.Comprador],
    },
  },
  { path: '', component: ListarPedidosComponent, data: { integracaoRequisicaoErp: false } },
  { path: ':idPedido', component: ManterPedidoComponent, data: { integracaoRequisicaoErp: false } },
  { path: 'configuracoespedido/configuracoes', component: ConfiguracoesPedidoComponent },
  { path: 'configuracoes/criterioavaliacaopedido', component: ListarCriteriosAvaliacaoComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidoRoutingModule { }
