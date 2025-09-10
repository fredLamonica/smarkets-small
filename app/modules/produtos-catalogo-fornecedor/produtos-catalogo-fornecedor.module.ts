import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { EditeProdutosCatalogoComponent } from './edite-produtos-catalogo/edite-produtos-catalogo.component';
import { ListarImportacaoContratoSellerComponent } from './listar-importacao-catalogo-seller/listar-importacao-catalogo-seller';
import { ListeCondicaoPagamentoContratoFornecedorComponent } from './manter-contrato-fornecedor/liste-condicao-pagamento-contrato-fornecedor/liste-condicao-pagamento-contrato-fornecedor.component';
import { EditeFaturamentoContratoFornecedorComponent } from './manter-contrato-fornecedor/liste-faturamento-contrato-fornecedor/edite-faturamento-contrato-fornecedor/edite-faturamento-contrato-fornecedor.component';
import { ListeFaturamentoContratoFornecedorComponent } from './manter-contrato-fornecedor/liste-faturamento-contrato-fornecedor/liste-faturamento-contrato-fornecedor.component';
import { ListeItensContratoFornecedorComponent } from './manter-contrato-fornecedor/liste-itens-contrato-fornecedor/liste-itens-contrato-fornecedor.component';
import { ManterPrazoEntregaItemComponent } from './manter-contrato-fornecedor/liste-itens-contrato-fornecedor/manter-prazo-entrega-item/manter-prazo-entrega-item.component';
import { ManterContratoFornecedorComponent } from './manter-contrato-fornecedor/manter-contrato-fornecedor.component';
import { ProdutosCatalogoFornecedorRoutingModule } from './produtos-catalogo-fornecedor-routing';
import { ProdutosCatalogoFornecedorComponent } from './produtos-catalogo-fornecedor.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ProdutosCatalogoFornecedorRoutingModule,
    NgSelectModule,
    InfiniteScrollModule,
    SharedModule,
  ],
  declarations: [
    ProdutosCatalogoFornecedorComponent,
    ManterContratoFornecedorComponent,
    EditeProdutosCatalogoComponent,
    ListeFaturamentoContratoFornecedorComponent,
    ListeItensContratoFornecedorComponent,
    ListeCondicaoPagamentoContratoFornecedorComponent,
    ListarImportacaoContratoSellerComponent,
    EditeFaturamentoContratoFornecedorComponent,
    ManterPrazoEntregaItemComponent,
  ],
  entryComponents: [
    EditeProdutosCatalogoComponent,
    ListeFaturamentoContratoFornecedorComponent,
    ListeCondicaoPagamentoContratoFornecedorComponent,
    ListeItensContratoFornecedorComponent,
    EditeFaturamentoContratoFornecedorComponent,
    ManterPrazoEntregaItemComponent
  ],
})
export class ProdutosCatalogoFornecedorModule { }
