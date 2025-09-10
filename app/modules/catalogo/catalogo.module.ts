import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgbCarouselModule, NgbDatepickerModule, NgbModalModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SolicitacaoProdutoModule } from '../solicitacao-produto/solicitacao-produto.module';
import { CarrinhoCatalogoComponent } from './carrinho-catalogo/carrinho-catalogo.component';
import { CarrinhoRequisicaoComponent } from './carrinho-requisicao/carrinho-requisicao.component';
import { RequisicaoItemComponent } from './carrinho-requisicao/requisicao/requisicao-item/requisicao-item.component';
import { RequisicaoComponent } from './carrinho-requisicao/requisicao/requisicao.component';
import { CarrinhoComponent } from './carrinho/carrinho.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { DetalhesProdutoComponent } from './detalhes-produto/detalhes-produto.component';
import { SelecionarCategoriaComponent } from './selecionar-categoria/selecionar-categoria.component';
import { SelecionarFornecedorComponent } from './selecionar-fornecedor/selecionar-fornecedor.component';
import { SelecionarMarcaComponent } from './selecionar-marca/selecionar-marca.component';
import { CarrinhoRegularizacaoComponent } from './carrinho-regularizacao/carrinho-regularizacao.component';
import { RegularizacaoItemComponent } from './carrinho-regularizacao/regularizacao-item/regularizacao-item.component';
import { RegularizacaoComponent } from './carrinho-regularizacao/regularizacao/regularizacao.component';

@NgModule({
  imports: [
    CommonModule,
    CatalogoRoutingModule,
    SharedModule,
    NgbTabsetModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbTabsetModule,
    InfiniteScrollModule,
    TextMaskModule,
    SolicitacaoProdutoModule,
    NgbTooltipModule,
    NgbCarouselModule,
  ],
  declarations: [
    CarrinhoComponent,
    CarrinhoCatalogoComponent,
    CarrinhoRequisicaoComponent,
    RequisicaoItemComponent,
    RequisicaoComponent,
    SelecionarFornecedorComponent,
    SelecionarMarcaComponent,
    DetalhesProdutoComponent,
    SelecionarCategoriaComponent,
    CarrinhoRegularizacaoComponent,
    RegularizacaoItemComponent,
    RegularizacaoComponent,
  ],
  entryComponents: [
    CarrinhoCatalogoComponent,
    CarrinhoRequisicaoComponent,
    SelecionarFornecedorComponent,
    SelecionarMarcaComponent,
    DetalhesProdutoComponent,
    SelecionarCategoriaComponent,
  ],
  providers: [ScrollToService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    SelecionarFornecedorComponent,
    SelecionarMarcaComponent,
    SelecionarCategoriaComponent,
  ],
})
export class CatalogoModule { }
