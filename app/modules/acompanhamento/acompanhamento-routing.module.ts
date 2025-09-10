import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoRequisicaoGuard } from '@shared/guards/permissao-requisicao.guard';
import { PermissaoSolicitacaoCompraGuard } from '@shared/guards/permissao-solicitacao-compra.guard';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { PerfilUsuario } from '@shared/models';
import { ListarRequisicoesComponent } from './acompanhamento-requisicao/listar-requisicoes/listar-requisicoes.component';
import { AcompanhamentoComponent } from './acompanhamento/acompanhamento.component';

const routes: Routes = [
  { path: '', component: AcompanhamentoComponent },
  { path: 'requisicoes', component: ListarRequisicoesComponent },
  {
    path: 'cotacoes',
    loadChildren: './../cotacao/cotacao.module#CotacaoModule',
    canActivate: [PermissaoGuard, PermissaoRequisicaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Comprador,
        PerfilUsuario.Cadastrador,
        PerfilUsuario.Fornecedor,
      ],
    },
  },
  {
    path: 'solicitacoes-compra',
    loadChildren: './../solicitacao-compra/solicitacao-compra.module#SolicitacaoCompraModule',
    canActivate: [PermissaoGuard, PermissaoSolicitacaoCompraGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Comprador,
        PerfilUsuario.Cadastrador,
        PerfilUsuario.Requisitante,
      ],
    },
  },
  {
    path: 'solicitacoes-compra/importacao',
    canActivate: [PermissaoGuard, PermissaoSolicitacaoCompraGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Comprador,
        PerfilUsuario.Cadastrador,
        PerfilUsuario.Requisitante,
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcompanhamentoRoutingModule { }
