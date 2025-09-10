import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '../../shared/shared.module';
import { ListeCategoriasComponent } from './liste-categorias/liste-categorias.component';
import { GereProdutoComponent } from './liste-produtos/gere-produto/gere-produto.component';
import { ListeProdutosComponent } from './liste-produtos/liste-produtos.component';
import { PdmSellerRoutingModule } from './pdm-seller-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PdmSellerRoutingModule,
    SharedModule,
    NgbTabsetModule,
    NgbCarouselModule,
    TextMaskModule,
    InfiniteScrollModule,
  ],
  declarations: [
    ListeCategoriasComponent,
    ListeProdutosComponent,
    GereProdutoComponent
  ],
  entryComponents: [
    GereProdutoComponent
  ],
})
export class PdmSellerModule { }
