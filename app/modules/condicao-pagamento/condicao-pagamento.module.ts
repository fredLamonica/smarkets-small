import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CondicaoPagamentoRoutingModule } from './condicao-pagamento-routing.module';
import { ManterCondicaoPagamentoComponent } from './manter-condicao-pagamento/manter-condicao-pagamento.component';
import { ListarCondicoesPagamentoComponent } from './listar-condicoes-pagamento/listar-condicoes-pagamento.component';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    CommonModule,
    CondicaoPagamentoRoutingModule,
    SharedModule,
    TextMaskModule,
    InfiniteScrollModule,
    TreeModule.forRoot()
  ],
  declarations: [ManterCondicaoPagamentoComponent, ListarCondicoesPagamentoComponent],
  entryComponents:[ManterCondicaoPagamentoComponent],
  exports:[ManterCondicaoPagamentoComponent]
})
export class CondicaoPagamentoModule { }
