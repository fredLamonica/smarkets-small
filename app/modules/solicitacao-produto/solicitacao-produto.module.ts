import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TreeModule } from 'angular-tree-component';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from './../../shared/shared.module';
import { ListarSolicitacaoProdutoComponent } from './listar-solicitacao-produto/listar-solicitacao-produto.component';
import { ModalMotivoCancelamentoSolicitacaoProdutoComponent } from './listar-solicitacao-produto/modal-motivo-cancelamento-solicitacao-produto/modal-motivo-cancelamento-solicitacao-produto.component';
import { ManterSolicitacaoProdutoComponent } from './manter-solicitacao-produto/manter-solicitacao-produto.component';
import { SolicitacaoProdutoRoutingModule } from './solicitacao-produto-routing.module';
import { ModalObservacoesComponent } from './listar-solicitacao-produto/modal-observacoes/modal-observacoes.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SolicitacaoProdutoRoutingModule,
    TextMaskModule,
    InfiniteScrollModule,
    TreeModule.forRoot()
  ],
  declarations: [ListarSolicitacaoProdutoComponent, ManterSolicitacaoProdutoComponent, ModalMotivoCancelamentoSolicitacaoProdutoComponent, ModalObservacoesComponent],
  entryComponents: [ManterSolicitacaoProdutoComponent, ModalMotivoCancelamentoSolicitacaoProdutoComponent,ModalObservacoesComponent],
  exports: [ManterSolicitacaoProdutoComponent]
})
export class SolicitacaoProdutoModule { }
