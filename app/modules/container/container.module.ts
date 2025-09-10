import { NgModule } from '@angular/core';
import { NgbAccordionModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { NotificacaoSignalRComponent } from '../../shared/components/notificacao-signalr/notificacao-signalr.component';
import { ContratosFornecedorModule } from '../contratos-fornecedor/contratos-fornecedor.module';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { ProdutosCatalogoFornecedorModule } from '../produtos-catalogo-fornecedor/produtos-catalogo-fornecedor.module';
import { ContainerRoutingModule } from './container-routing.module';
import { ContainerComponent } from './container/container.component';
import { InfoUsuarioComponent } from './info-usuario/info-usuario.component';
import { ResumoCarrinhoComponent } from './resumo-carrinho/resumo-carrinho.component';

@NgModule({
  imports: [
    ContainerRoutingModule,
    SharedModule,
    NgbTabsetModule,
    NgbAccordionModule,
    MarketplaceModule,
    ContratosFornecedorModule,
    ProdutosCatalogoFornecedorModule,
  ],
  declarations: [ContainerComponent, ResumoCarrinhoComponent, InfoUsuarioComponent, NotificacaoSignalRComponent],
})
export class ContainerModule { }
