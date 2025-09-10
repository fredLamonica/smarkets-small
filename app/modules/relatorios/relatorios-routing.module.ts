import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoricoAprovacaoComponent } from './historico-aprovacao/historico-aprovacao.component';
import { HistoricoPedidosComponent } from './historico-pedidos/historico-pedidos.component';
import { RelatorioAcessaramPlataformaComponent } from './relatorio-acessaram-plataforma/relatorio-acessaram-plataforma.component';
import { RelatorioCatalogosFornecedorComponent } from './relatorio-catalogos-fornecedor/relatorio-catalogos-fornecedor.component';
import { RelatorioParticipacaoCotacaoComponent } from './relatorio-participacao-cotacao/relatorio-participacao-cotacao.component';
import { RelatorioRequisicaoComponent } from './relatorio-requisicao/relatorio-requisicao.component';
import { RelatorioSolicitacaoCompraComponent } from './relatorio-solicitacao-compra/relatorio-solicitacao-compra.component';

const routes: Routes = [
  { path: 'historico-pedidos', component: HistoricoPedidosComponent },
  { path: 'historico-aprovacao', component: HistoricoAprovacaoComponent },
  { path: 'solicitacao-compra', component: RelatorioSolicitacaoCompraComponent },
  { path: 'participacao-cotacao', component: RelatorioParticipacaoCotacaoComponent },
  { path: 'acessaram-plataforma', component: RelatorioAcessaramPlataformaComponent },
  { path: 'relatorio-requisicao', component: RelatorioRequisicaoComponent },
  { path: 'catalogos-fornecedor', component: RelatorioCatalogosFornecedorComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatoriosRoutingModule { }
