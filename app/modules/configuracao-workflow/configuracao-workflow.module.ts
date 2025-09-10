import { AuditoriaComponent } from '@shared/components';
import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfiguracaoWorkflowRoutingModule } from './configuracao-workflow-routing.module';
import { ConfiguracaoWorkflowComponent } from './configuracao-workflow/configuracao-workflow.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ManterTipoRequisicaoComponent } from './tipo-requisicao/manter-tipo-requisicao/manter-tipo-requisicao.component';
import { ListarTiposRequisicaoComponent } from './tipo-requisicao/listar-tipos-requisicao/listar-tipos-requisicao.component';
import { ListarSlaComponent } from './sla/listar-sla/listar-sla.component';

import { ManterClassificacaoComponent } from './sla/manter-classificacao/manter-classificacao.component';
import { ManterSlaComponent } from './sla/manter-sla/manter-sla.component';
import { ListarTiposPedidoComponent } from './tipo-pedido/listar-tipos-pedido/listar-tipos-pedido.component';
import { ManterTipoPedidoComponent } from './tipo-pedido/manter-tipo-pedido/manter-tipo-pedido.component';
import { ListarMotivoDesclassificacaoComponent } from './motivo-desclassificacao/listar-motivo-desclassificacao/listar-motivo-desclassificacao.component';
import { ManterMotivoDesclassificacaoComponent } from './motivo-desclassificacao/manter-motivo-desclassificacao/manter-motivo-desclassificacao.component';

@NgModule({
  declarations: [
    ConfiguracaoWorkflowComponent,
    ListarTiposRequisicaoComponent,
    ManterTipoRequisicaoComponent,
    ListarTiposRequisicaoComponent,
    ListarSlaComponent,
    ManterSlaComponent,
    ManterClassificacaoComponent,
    ListarTiposPedidoComponent,
    ManterTipoPedidoComponent,
    ListarMotivoDesclassificacaoComponent,
    ManterMotivoDesclassificacaoComponent
  ],
  imports: [
    CommonModule,
    ConfiguracaoWorkflowRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    NgbModalModule
  ],
  entryComponents: [
    ListarTiposRequisicaoComponent,
    ManterTipoRequisicaoComponent,
    AuditoriaComponent,
    ManterSlaComponent,
    ListarSlaComponent,
    ManterClassificacaoComponent,
    ListarTiposPedidoComponent,
    ManterTipoPedidoComponent,
    ManterMotivoDesclassificacaoComponent
  ]
})
export class ConfiguracaoWorkflowModule {}
