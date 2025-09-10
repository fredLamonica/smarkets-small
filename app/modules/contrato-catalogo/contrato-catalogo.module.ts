import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ListarAnexosContratoComponent } from './anexos-contrato-catalogo/listar-anexos-contrato/listar-anexos-contrato.component';
import { ContratoCatalogoRoutingModule } from './contrato-catalogo-routing.module';
import { ListarEstadosContratoComponent } from './estados-contrato-catalogo/listar-estados-contrato/listar-estados-contrato.component';
import { ReajusteEstadosContratoComponent } from './estados-contrato-catalogo/reajuste-estados-contrato/reajuste-estados-contrato.component';
import { RecusaReajusteEstadoComponent } from './estados-contrato-catalogo/reajuste-estados-contrato/recusa-reajuste-estado/recusa-reajuste-estado.component';
import { ListeFaturamentoContratoCatalogoComponent } from './faturamento-contrato-catalogo/liste-faturamento-contrato-catalogo/liste-faturamento-contrato-catalogo.component';
import { ReajusteFaturamentoContratoCatalogoComponent } from './faturamento-contrato-catalogo/reajuste-faturamento-contrato-catalogo/reajuste-faturamento-contrato-catalogo.component';
import { RecusaReajusteFaturamentoComponent } from './faturamento-contrato-catalogo/recusa-reajuste-faturamento/recusa-reajuste-faturamento.component';
import { ListarItensContratoComponent } from './itens-contrato-catalogo/listar-itens-contrato/listar-itens-contrato.component';
import { ManterItemContratoComponent } from './itens-contrato-catalogo/manter-item-contrato/manter-item-contrato.component';
import { ReajusteItemContratoComponent } from './itens-contrato-catalogo/reajuste-item-contrato/reajuste-item-contrato.component';
import { RecusaReajusteItemComponent } from './itens-contrato-catalogo/reajuste-item-contrato/recusa-reajuste-item/recusa-reajuste-item.component';
import { ListarCondicaoPagamentoContratoCatalogoComponent } from './listar-condicao-pagamento-contrato-catalogo/listar-condicao-pagamento-contrato-catalogo.component';
import { AlteracaoDirective } from './listar-contratos-catalogo/directives/alteracao.directives';
import { OrigemClonagemDirective } from './listar-contratos-catalogo/directives/origem-clonagem.directives';
import { ListarContratosCatalogoComponent } from './listar-contratos-catalogo/listar-contratos-catalogo.component';
import { ManterContratoCatalogoComponent } from './manter-contrato-catalogo/manter-contrato-catalogo.component';
import { ListarParticipantesContratoComponent } from './participantes-contrato-catalogo/listar-participantes-contrato/listar-participantes-contrato.component';
import { ManterParticipanteContratoComponent } from './participantes-contrato-catalogo/manter-participante-contrato/manter-participante-contrato.component';
import { ManterParticipanteItensContratoComponent } from './participantes-contrato-catalogo/manter-participante-itens-contrato/manter-participante-itens-contrato.component';
import { ProdutosItensParticipanteComponent } from './participantes-contrato-catalogo/produtos-itens-participante/produtos-itens-participante.component';
import { VincularItemParticipanteContratoComponent } from './participantes-contrato-catalogo/vincular-item-participante-contrato/vincular-item-participante-contrato.component';
import { VincularProdutoItemParticipanteComponent } from './participantes-contrato-catalogo/vincular-item-participante-contrato/vincular-produto-item-participante/vincular-produto-item-participante.component';

@NgModule({
  imports: [
    CommonModule,
    ContratoCatalogoRoutingModule,
    SharedModule,
    TextMaskModule,
    InfiniteScrollModule
  ],
  declarations: [
    ListarContratosCatalogoComponent,
    ManterContratoCatalogoComponent,
    ManterItemContratoComponent,
    ListarItensContratoComponent,
    ManterParticipanteContratoComponent,
    ListarParticipantesContratoComponent,
    ManterParticipanteItensContratoComponent,
    ListarEstadosContratoComponent,
    ListarAnexosContratoComponent,
    ListarCondicaoPagamentoContratoCatalogoComponent,
    ProdutosItensParticipanteComponent,
    VincularItemParticipanteContratoComponent,
    VincularProdutoItemParticipanteComponent,
    ReajusteItemContratoComponent,
    RecusaReajusteItemComponent,
    ReajusteEstadosContratoComponent,
    RecusaReajusteEstadoComponent,
    OrigemClonagemDirective,
    AlteracaoDirective,
    ListeFaturamentoContratoCatalogoComponent,
    ReajusteFaturamentoContratoCatalogoComponent,
    RecusaReajusteFaturamentoComponent,
  ],
  entryComponents: [
    ManterItemContratoComponent,
    ManterParticipanteContratoComponent,
    ManterParticipanteItensContratoComponent,
    ProdutosItensParticipanteComponent,
    VincularItemParticipanteContratoComponent,
    VincularProdutoItemParticipanteComponent,
    ReajusteItemContratoComponent,
    RecusaReajusteItemComponent,
    ReajusteEstadosContratoComponent,
    ReajusteFaturamentoContratoCatalogoComponent,
    RecusaReajusteFaturamentoComponent,
    RecusaReajusteEstadoComponent,
  ],
  providers: [DatePipe]
})
export class ContratoCatalogoModule {}
