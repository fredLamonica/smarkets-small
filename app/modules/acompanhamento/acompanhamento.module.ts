import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ManterItemSolicitacaoCompraComponent } from './../solicitacao-compra/item-solicitacao-compra/manter-item-solicitacao-compra/manter-item-solicitacao-compra.component';
import { AcompanhamentoCotacaoComponent } from './acompanhamento-cotacao/acompanhamento-cotacao.component';
import { CotacaoItemComponent } from './acompanhamento-cotacao/cotacao-item/cotacao-item.component';
import { CotacaoComponent } from './acompanhamento-cotacao/cotacao/cotacao.component';
import { AcompanhamentoPedidoComponent } from './acompanhamento-pedido/acompanhamento-pedido.component';
import { AcompanhamentoRequisicaoComponent } from './acompanhamento-requisicao/acompanhamento-requisicao.component';
import { ListarRequisicoesComponent } from './acompanhamento-requisicao/listar-requisicoes/listar-requisicoes.component';
import { ManterRequisicaoItemComponent } from './acompanhamento-requisicao/manter-requisicao-item/manter-requisicao-item.component';
import { ManterUsuarioResponsavelComponent } from './acompanhamento-requisicao/manter-usuario-responsavel/manter-usuario-responsavel.component';
import { RequisicaoItemComponent } from './acompanhamento-requisicao/requisicao-item/requisicao-item.component';
import { AcompanhamentoRoutingModule } from './acompanhamento-routing.module';
import { AcompanhamentoSolicitacaoCompraComponent } from './acompanhamento-solicitacao-compra/acompanhamento-solicitacao-compra.component';
import { AcompanhamentoComponent } from './acompanhamento/acompanhamento.component';
import { AcompanhamentosComponent } from './acompanhamentos/acompanhamentos.component';
import { ContadorSlaComponent } from './contador-sla/contador-sla.component';
import { ItemComentarioModalComponent } from './item-comentario-modal/item-comentario-modal.component';
import { SituacaoRequisicaoItemPipe } from './acompanhamento-requisicao/listar-requisicoes/pipes/situacao-requisicao-item.pipe';
import { SituacaoRequisicaoItemDirective } from './acompanhamento-requisicao/listar-requisicoes/directives/situacao-requisicao-item.directive';

@NgModule({
  declarations: [
    AcompanhamentoComponent,
    AcompanhamentoPedidoComponent,
    AcompanhamentoRequisicaoComponent,
    ManterRequisicaoItemComponent,
    AcompanhamentoCotacaoComponent,
    CotacaoComponent,
    CotacaoItemComponent,
    ManterUsuarioResponsavelComponent,
    AcompanhamentoSolicitacaoCompraComponent,
    RequisicaoItemComponent,
    ItemComentarioModalComponent,
    ContadorSlaComponent,
    AcompanhamentosComponent,
    ListarRequisicoesComponent,
    SituacaoRequisicaoItemPipe,
    SituacaoRequisicaoItemDirective,
  ],
  imports: [
    CommonModule,
    AcompanhamentoRoutingModule,
    SharedModule,
    TextMaskModule,
    NgbModalModule,
    InfiniteScrollModule,
  ],
  entryComponents: [
    AcompanhamentoPedidoComponent,
    AcompanhamentoRequisicaoComponent,
    RequisicaoItemComponent,
    ManterRequisicaoItemComponent,
    AcompanhamentoCotacaoComponent,
    CotacaoComponent,
    CotacaoItemComponent,
    ManterUsuarioResponsavelComponent,
    AcompanhamentoSolicitacaoCompraComponent,
    ItemComentarioModalComponent,
    ManterItemSolicitacaoCompraComponent,
  ],
})
export class AcompanhamentoModule { }
