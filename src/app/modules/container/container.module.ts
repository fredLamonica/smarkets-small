import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ContainerComponent } from './container/container.component';
import { ResumoCarrinhoComponent } from './resumo-carrinho/resumo-carrinho.component';
import { InfoUsuarioComponent } from './info-usuario/info-usuario.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'marketplace',
        loadChildren: () => import('../marketplace/marketplace.module').then(m => m.MarketplaceModule)
      },
      {
        path: 'carrinho',
        loadChildren: () => import('../catalogo/catalogo.module').then(m => m.CatalogoModule)
      },
      {
        path: 'cotacoes',
        loadChildren: () => import('../cotacao/cotacao.module').then(m => m.CotacaoModule)
      },
      {
        path: 'contratos-catalogo',
        loadChildren: () => import('../contrato-catalogo/contrato-catalogo.module').then(m => m.ContratoCatalogoModule)
      },
      {
        path: 'area-usuario',
        loadChildren: () => import('./configuracao-usuario/configuracao-usuario.module').then(m => m.ConfiguracaoUsuarioModule)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    ContainerComponent,
    ResumoCarrinhoComponent,
    InfoUsuarioComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class ContainerModule { }