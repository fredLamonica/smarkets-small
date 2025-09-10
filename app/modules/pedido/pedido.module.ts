import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AcaoPosRemocaoPedidoComponent } from './acao-pos-remocao-pedido/acao-pos-remocao-pedido.component';
import { ConfiguracoesPedidoComponent } from './configuracoes-pedido/configuracoes-pedido.component';
import { ConfiguracoesComponent } from './configuracoes-pedido/configuracoes/configuracoes.component';
import { ListarCriteriosAvaliacaoComponent } from './configuracoes-pedido/configuracoes/criterio-avaliacao-pedido/listar-criterios-avaliacao/listar-criterios-avaliacao.component';
import { ManterCriterioAvaliacaoComponent } from './configuracoes-pedido/configuracoes/criterio-avaliacao-pedido/manter-criterio-avaliacao/manter-criterio-avaliacao.component';
import { ObservacoesPadraoComponent } from './configuracoes-pedido/configuracoes/observacoes-padrao/observacoes-padrao.component';
import { ListarHistoricoRecebimentoPedidoComponent } from './listar-historico-recebimento-pedido/listar-historico-recebimento-pedido.component';
import { SituacaoPedidoItemDirective } from './listar-pedidos/directives/situacao-pedido-item.directive';
import { ListarPedidosComponent } from './listar-pedidos/listar-pedidos.component';
import { SituacaoPedidoItemPipe } from './listar-pedidos/pipes/situacao-pedido-item.pipe';
import { ManterAvaliacaoComponent } from './manter-avaliacao/manter-avaliacao.component';
import { ManterDataEntregaPrevistaComponent } from './manter-data-entrega-prevista/manter-data-entrega-prevista';
import { ManterDataPrevistaProgramadaComponent } from './manter-data-prevista-programada/manter-data-prevista-programada.component';
import { ManterPedidoItemComponent } from './manter-pedido-item/manter-pedido-item.component';
import { ExibirEnderecoComponent } from './manter-pedido/exibir-endereco/exibir-endereco.component';
import { ManterPedidoComponent } from './manter-pedido/manter-pedido.component';
import { ReceberPedidoJustificativaComponent } from './manter-pedido/receber-pedido-justificativa/receber-pedido-justificativa.component';
import { ReceberPedidoComponent } from './manter-pedido/receber-pedido/receber-pedido.component';
import { PedidoRoutingModule } from './pedido-routing.module';
import { SelecionarOutroFornecedorComponent } from './selecionar-outro-fornecedor/selecionar-outro-fornecedor.component';
import { SelecionarOutroProdutoComponent } from './selecionar-outro-produto/selecionar-outro-produto.component';
import { VisualizarPedidoItemComponent } from './visualizar-pedido-item/visualizar-pedido-item.component';
@NgModule({
  imports: [
    CommonModule,
    PedidoRoutingModule,
    SharedModule,
    NgbTabsetModule,
    NgbCarouselModule,
    TextMaskModule,
    InfiniteScrollModule,
  ],
  declarations: [
    ListarPedidosComponent,
    ManterPedidoComponent,
    ManterPedidoItemComponent,
    SelecionarOutroFornecedorComponent,
    AcaoPosRemocaoPedidoComponent,
    SelecionarOutroProdutoComponent,
    ManterAvaliacaoComponent,
    ExibirEnderecoComponent,
    VisualizarPedidoItemComponent,
    ConfiguracoesPedidoComponent,
    ListarCriteriosAvaliacaoComponent,
    ManterCriterioAvaliacaoComponent,
    ConfiguracoesComponent,
    ObservacoesPadraoComponent,
    ListarHistoricoRecebimentoPedidoComponent,
    ReceberPedidoComponent,
    ReceberPedidoJustificativaComponent,
    SituacaoPedidoItemDirective,
    SituacaoPedidoItemPipe,
    ManterDataEntregaPrevistaComponent,
    ManterDataPrevistaProgramadaComponent,
  ],

  entryComponents: [
    ManterPedidoItemComponent,
    SelecionarOutroFornecedorComponent,
    AcaoPosRemocaoPedidoComponent,
    SelecionarOutroProdutoComponent,
    ManterAvaliacaoComponent,
    ExibirEnderecoComponent,
    VisualizarPedidoItemComponent,
    ConfiguracoesPedidoComponent,
    ManterCriterioAvaliacaoComponent,
    ConfiguracoesComponent,
    ObservacoesPadraoComponent,
    ListarHistoricoRecebimentoPedidoComponent,
    ReceberPedidoComponent,
    ReceberPedidoJustificativaComponent,
    ManterDataEntregaPrevistaComponent,
    ManterDataPrevistaProgramadaComponent,
  ],
  providers: [DatePipe],
})
export class PedidoModule { }
