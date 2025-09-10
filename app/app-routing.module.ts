import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutenticacaoGuard } from '@shared/guards/autenticacao.guard';
import { ManterParticipanteCampanhaComponent } from './modules/campanha/manter-participante-campanha/manter-participante-campanha.component';
import { EmptyComponent } from './shared/components/empty/empty.component';
import { SsoGuard } from './shared/guards/sso.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './modules/autenticacao/autenticacao.module#AutenticacaoModule',
  },
  {
    path: 'seja-um-fornecedor',
    loadChildren: './modules/fornecedor-interessado/fornecedor-interessado.module#FornecedorInteressadoModule',
  },
  {
    path: 'campanhas/:url',
    component: ManterParticipanteCampanhaComponent,
  },
  {
    path: '',
    loadChildren: './modules/container/container.module#ContainerModule',
    canActivate: [AutenticacaoGuard],
  },
  {
    path: 'login/:sso',
    canActivate: [SsoGuard],
    component: EmptyComponent,
  },
  { path: '**', component: EmptyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})

export class AppRoutingModule { }
