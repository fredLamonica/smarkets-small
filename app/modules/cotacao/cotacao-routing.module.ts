import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { PerfilUsuario } from '@shared/models';
import { CanDeactivateGuard } from '../../shared/guards/can-deactivate.guard';
import { ManterAceiteFornecedorComponent } from './manter-aceite-fornecedor/manter-aceite-fornecedor.component';
import { ManterCotacaoPropostaComponent } from './manter-cotacao-proposta/manter-cotacao-proposta.component';
import { ManterCotacaoComponent } from './manter-cotacao/manter-cotacao.component';
import { MapaComparativoPorItemComponent } from './mapa-comparativo-por-item/mapa-comparativo-por-item.component';

const routes: Routes = [
  {
    path: "novo", component: ManterCotacaoComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador]
    }
  },
  {
    path: ":idCotacao", component: ManterCotacaoComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador]
    }
  },
  {
    path: ":idCotacao/aceite", component: ManterAceiteFornecedorComponent,
    canActivate: [PermissaoGuard],
    data: { permissoes: [PerfilUsuario.Fornecedor] }
  },
  {
    path: ":idCotacao/propostas", component: ManterCotacaoPropostaComponent,
    canActivate: [PermissaoGuard],
    canDeactivate: [CanDeactivateGuard],
    data: { permissoes: [PerfilUsuario.Fornecedor] }
  },
  {
    path: ":idCotacao/mapa-comparativo-item", component: MapaComparativoPorItemComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CotacaoRoutingModule { }
