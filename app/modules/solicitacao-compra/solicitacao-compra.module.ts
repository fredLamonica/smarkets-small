import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitacaoCompraRoutingModule } from './solicitacao-compra-routing.module';
import { ManterSolicitacaoCompraComponent } from './manter-solicitacao-compra/manter-solicitacao-compra.component';
import { ItemSolicitacaoCompraComponent } from './item-solicitacao-compra/item-solicitacao-compra.component';
import { VincularProdutoExistenteComponent } from './vincular-produto-existente/vincular-produto-existente.component';
import { ConfirmarVinculoProdutoComponent } from './confirmar-vinculo-produto/confirmar-vinculo-produto.component';
import { SubItemSolicitacaoCompraComponent } from './sub-item-solicitacao-compra/sub-item-solicitacao-compra.component';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModalModule, NgbTooltipModule, NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { VincularProdutoItemComponent } from './item-solicitacao-compra/vincular-produto-item/vincular-produto-item.component';
import { ConfirmarVinculoPedidoItemComponent } from './item-solicitacao-compra/confirmar-vinculo-pedido-item/confirmar-vinculo-pedido-item.component';
import { ManterItemSolicitacaoCompraComponent } from './item-solicitacao-compra/manter-item-solicitacao-compra/manter-item-solicitacao-compra.component';
import { VincularProdutoSubItemComponent } from './sub-item-solicitacao-compra/vincular-produto-sub-item/vincular-produto-sub-item.component';
import { ManterSubItemSolicitacaoCompraComponent } from './sub-item-solicitacao-compra/manter-sub-item-solicitacao-compra/manter-sub-item-solicitacao-compra.component';
import { ConfirmarVinculoPedidoSubItemComponent } from './sub-item-solicitacao-compra/confirmar-vinculo-pedido-sub-item/confirmar-vinculo-pedido-sub-item.component';
import { ConfirmarVinculoRequisicaoSubItemComponent } from './sub-item-solicitacao-compra/confirmar-vinculo-requisicao-sub-item/confirmar-vinculo-requisicao-sub-item.component';
import { ConfirmarVinculoRequisicaoItemComponent } from './item-solicitacao-compra/confirmar-vinculo-requisicao-item/confirmar-vinculo-requisicao-item.component';
import { ManterProdutoModalComponent } from '@shared/components';
import { CancelarSolicitacaoCompraComponent } from './cancelar-solicitacao-compra/cancelar-solicitacao-compra.component';
import { DevolverSolicitacaoCompraComponent } from './devolver-solicitacao-compra/devolver-solicitacao-compra.component';
import { ManterPedidoRegularizacaoComponent } from './manter-pedido-regularizacao/manter-pedido-regularizacao.component';
import { ImportacaoSolicitacaoCompra } from '@shared/models/importacao-solicitacao-compra';
import { DesbloqueioItemSolicitacaoCompraComponent } from './manter-solicitacao-compra/desbloqueio-item-solicitacao-compra/desbloqueio-item-solicitacao-compra.component';

@NgModule({
  declarations: [
    ManterSolicitacaoCompraComponent,
    VincularProdutoExistenteComponent,
    ConfirmarVinculoProdutoComponent,

    //Item Solicitacao Compra
    ItemSolicitacaoCompraComponent,
    VincularProdutoItemComponent,
    ConfirmarVinculoPedidoItemComponent,

    //Sub Item Solicitacao Compra
    SubItemSolicitacaoCompraComponent,
    ManterSubItemSolicitacaoCompraComponent,
    VincularProdutoSubItemComponent,
    ConfirmarVinculoPedidoSubItemComponent,
    ConfirmarVinculoRequisicaoItemComponent,
    ConfirmarVinculoRequisicaoSubItemComponent,
    CancelarSolicitacaoCompraComponent,
    DevolverSolicitacaoCompraComponent,
    ManterPedidoRegularizacaoComponent,
    DesbloqueioItemSolicitacaoCompraComponent
  ],
  imports: [
    CommonModule,
    SolicitacaoCompraRoutingModule,
    SharedModule,
    TextMaskModule,
    NgbModalModule,
    NgbTooltipModule,
    NgbCarouselModule
  ],
  entryComponents: [
    VincularProdutoExistenteComponent,
    ConfirmarVinculoProdutoComponent,
    ManterPedidoRegularizacaoComponent,
    ManterProdutoModalComponent,
    DesbloqueioItemSolicitacaoCompraComponent,

    //Item Solicitacao Compra
    ItemSolicitacaoCompraComponent,
    VincularProdutoItemComponent,
    ConfirmarVinculoPedidoItemComponent,
    ConfirmarVinculoRequisicaoItemComponent,

    //Sub Item Solicitação Compra
    SubItemSolicitacaoCompraComponent,
    ManterSubItemSolicitacaoCompraComponent,
    VincularProdutoSubItemComponent,
    ConfirmarVinculoPedidoSubItemComponent,
    ConfirmarVinculoRequisicaoSubItemComponent,
    CancelarSolicitacaoCompraComponent,
    DevolverSolicitacaoCompraComponent
  ]
})
export class SolicitacaoCompraModule {}
