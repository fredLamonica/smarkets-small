import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CotacaoRoutingModule } from './cotacao-routing.module';
import { ManterCotacaoComponent } from './manter-cotacao/manter-cotacao.component';
import { ManterCotacaoItensComponent } from './manter-cotacao-itens/manter-cotacao-itens.component';
import { ManterCotacaoParticipantesComponent } from './manter-cotacao-participantes/manter-cotacao-participantes.component';
import { ManterAceiteFornecedorComponent } from './manter-aceite-fornecedor/manter-aceite-fornecedor.component';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ArchwizardModule } from 'angular-archwizard';
import { ManterCotacaoPropostaItemComponent } from './manter-cotacao-proposta/manter-cotacao-proposta-item/manter-cotacao-proposta-item.component';
import { IncluirFornecedorComponent } from './manter-cotacao-participantes/incluir-fornecedor/incluir-fornecedor.component';
import { ManterCotacaoRodadaPropostaComponent } from './manter-cotacao-proposta/manter-cotacao-rodada-proposta/manter-cotacao-rodada-proposta.component';
import { ManterCotacaoPropostaComponent } from './manter-cotacao-proposta/manter-cotacao-proposta.component';
import { MapaComparativoPorItemComponent } from './mapa-comparativo-por-item/mapa-comparativo-por-item.component';
import { MapaComparativoItemComponent } from './mapa-comparativo-por-item/mapa-comparativo-item/mapa-comparativo-item.component';
import { ManterCotacaoRodadaComponent } from './manter-cotacao-rodada/manter-cotacao-rodada.component';
import { ManterCotacaoPedidoComponent } from './manter-cotacao-pedido/manter-cotacao-pedido.component';
import { ManterRequisicaoItemComponent } from './mapa-comparativo-por-item/manter-requisicao-item/manter-requisicao-item.component';
import { ManterFornecedorRodadaComponent } from './mapa-comparativo-por-item/manter-fornecedor-rodada/manter-fornecedor-rodada.component';
import { PermitirAlterarPropostaComponent } from './mapa-comparativo-por-item/permitir-alterar-proposta/permitir-alterar-proposta.component';
import { SelectListFornecedorComponent } from './mapa-comparativo-por-item/permitir-alterar-proposta/select-list-fornecedor/select-list-fornecedor.component';
import { ManterDesclassificacaoPropostaComponent } from './mapa-comparativo-por-item/manter-desclassificacao-proposta/manter-desclassificacao-proposta.component';
import { ConfirmarEncerrarCotacaoComponent } from './confirmar-encerrar-cotacao/confirmar-encerrar-cotacao.component';
import { ListarRequisicoesNaoFinalizadasComponent } from './listar-requisicoes-nao-finalizadas/listar-requisicoes-nao-finalizadas.component';
import { ListarAnexosParticipantesComponent } from './manter-cotacao-participantes/listar-anexos-participantes/listar-anexos-participantes.component';

@NgModule({
  declarations: [
    ManterCotacaoComponent,
    ManterCotacaoItensComponent,
    ManterCotacaoParticipantesComponent,
    ManterAceiteFornecedorComponent,
    ManterCotacaoPropostaComponent,
    ManterCotacaoPropostaItemComponent,
    IncluirFornecedorComponent,
    ManterCotacaoRodadaPropostaComponent,
    MapaComparativoPorItemComponent,
    MapaComparativoItemComponent,
    ManterCotacaoRodadaComponent,
    ManterCotacaoPedidoComponent,
    ManterRequisicaoItemComponent,
    ManterFornecedorRodadaComponent,
    PermitirAlterarPropostaComponent,
    SelectListFornecedorComponent,
    ManterDesclassificacaoPropostaComponent,
    ConfirmarEncerrarCotacaoComponent,
    ListarRequisicoesNaoFinalizadasComponent,
    ListarAnexosParticipantesComponent
  ],
  imports: [
    CommonModule,
    CotacaoRoutingModule,
    SharedModule,
    TextMaskModule,
    NgbModalModule,
    ArchwizardModule
  ],
  entryComponents: [
    ManterCotacaoItensComponent,
    ManterCotacaoParticipantesComponent,
    ManterCotacaoPropostaItemComponent,
    IncluirFornecedorComponent,
    ManterCotacaoRodadaPropostaComponent,
    MapaComparativoItemComponent,
    ManterCotacaoRodadaComponent,
    ManterCotacaoPedidoComponent,
    ManterRequisicaoItemComponent,
    ManterFornecedorRodadaComponent,
    PermitirAlterarPropostaComponent,
    ManterDesclassificacaoPropostaComponent,
    ConfirmarEncerrarCotacaoComponent,
    ListarRequisicoesNaoFinalizadasComponent,
    ListarAnexosParticipantesComponent
  ]
})
export class CotacaoModule {}
