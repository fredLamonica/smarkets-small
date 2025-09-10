import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../shared/shared.module';
import { CatalogoModule } from '../catalogo/catalogo.module';
import { AbaCatalogoComponent } from './components/aba-catalogo/aba-catalogo.component';
import { AbaRequisicaoComponent } from './components/aba-requisicao/aba-requisicao.component';
import { FiltroCatalogoComponent } from './components/filtro-catalogo/filtro-catalogo.component';
import { FiltroRequisicaoComponent } from './components/filtro-requisicao/filtro-requisicao.component';
import { FiltroSuperiorComponent } from './components/filtro-superior/filtro-superior.component';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MarketplaceComponent } from './marketplace.component';

@NgModule({
  declarations: [
    MarketplaceComponent,
    FiltroSuperiorComponent,
    FiltroCatalogoComponent,
    FiltroRequisicaoComponent,
    AbaCatalogoComponent,
    AbaRequisicaoComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MarketplaceRoutingModule,
    CatalogoModule,
    NgSelectModule,
    InfiniteScrollModule,
    SharedModule,
  ],
  entryComponents: [
    FiltroCatalogoComponent,
    FiltroRequisicaoComponent,
    FiltroSuperiorComponent,
    AbaCatalogoComponent,
    AbaRequisicaoComponent,
  ],
})
export class MarketplaceModule { }
