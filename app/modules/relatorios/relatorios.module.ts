import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { HistoricoAprovacaoComponent } from './historico-aprovacao/historico-aprovacao.component';
import { HistoricoPedidosComponent } from './historico-pedidos/historico-pedidos.component';
import { RelatorioAcessaramPlataformaComponent } from './relatorio-acessaram-plataforma/relatorio-acessaram-plataforma.component';
import { RelatorioCatalogosFornecedorComponent } from './relatorio-catalogos-fornecedor/relatorio-catalogos-fornecedor.component';
import { RelatorioParticipacaoCotacaoComponent } from './relatorio-participacao-cotacao/relatorio-participacao-cotacao.component';
import { RelatorioRequisicaoComponent } from './relatorio-requisicao/relatorio-requisicao.component';
import { RelatorioSolicitacaoCompraComponent } from './relatorio-solicitacao-compra/relatorio-solicitacao-compra.component';
import { RelatoriosRoutingModule } from './relatorios-routing.module';

@NgModule({
  declarations: [
    HistoricoAprovacaoComponent,
    RelatorioSolicitacaoCompraComponent,
    RelatorioParticipacaoCotacaoComponent,
    HistoricoPedidosComponent,
    RelatorioAcessaramPlataformaComponent,
    RelatorioRequisicaoComponent,
    RelatorioCatalogosFornecedorComponent,
  ],
  imports: [RelatoriosRoutingModule, SharedModule, CommonModule],
})
export class RelatoriosModule { }
