import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MockAuthGuard } from './shared/guards/mock-auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./modules/autenticacao/autenticacao.module').then(m => m.AutenticacaoModule)
  },
  {
    path: '',
    canActivate: [MockAuthGuard],
    loadChildren: () => import('./modules/container/container.module').then(m => m.ContainerModule)
  },
  {
    path: '**',
    loadChildren: () => import('./modules/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }