import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SolicitacaoCadastroProdutoServicoRoutingModule } from './solicitacao-cadastro-produto-servico-routing.module';
import { ListarSlaComponent } from './listar-sla/listar-sla.component';
import { SharedModule } from '@shared/shared.module';
import { ItemSlaSolicitacaoComponent } from './listar-sla/item-sla-solicitacao/item-sla-solicitacao.component';
import { ModalIncluirEditarSlaComponent } from './modal-incluir-editar-sla/modal-incluir-editar-sla.component';

@NgModule({
  declarations: [ListarSlaComponent, ItemSlaSolicitacaoComponent,ModalIncluirEditarSlaComponent],
  imports: [
    CommonModule,
    SolicitacaoCadastroProdutoServicoRoutingModule,
    SharedModule,
  ],
  entryComponents: [ListarSlaComponent, ModalIncluirEditarSlaComponent],
  exports: [ListarSlaComponent, ModalIncluirEditarSlaComponent]
})
export class SolicitacaoCadastroProdutoServicoModule { }
