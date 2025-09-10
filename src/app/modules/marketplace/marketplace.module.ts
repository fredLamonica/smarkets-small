import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MarketplaceComponent } from './marketplace.component';
import { AbaCatalogoComponent } from './components/aba-catalogo/aba-catalogo.component';
import { FiltroSuperiorComponent } from './components/filtro-superior/filtro-superior.component';
import { CatalogoItemComponent } from '../../shared/components/catalogo-item/catalogo-item.component';

const routes: Routes = [
  {
    path: '',
    component: MarketplaceComponent
  }
];

@NgModule({
  declarations: [
    MarketplaceComponent,
    AbaCatalogoComponent,
    FiltroSuperiorComponent,
    CatalogoItemComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MarketplaceModule { }