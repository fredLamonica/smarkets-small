import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AreaUsuarioComponent } from './area-usuario/area-usuario.component';
import { ConfiguracaoUsuarioRoutingModule } from './configuracao-usuario-routing.module';
import { HistoricoComprasComponent } from './historico-compras/historico-compras.component';
import { InformacoesPessoaisComponent } from './informacoes-pessoais/informacoes-pessoais.component';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { ProdutosFavoritosComponent } from './produtos-favoritos/produtos-favoritos.component';

@NgModule({
  declarations: [InformacoesPessoaisComponent, ProdutosFavoritosComponent, AreaUsuarioComponent, HistoricoComprasComponent, NotificacoesComponent,

  ],
  imports: [
    CommonModule,
    ConfiguracaoUsuarioRoutingModule,
    InfiniteScrollModule,
    SharedModule,
    NgbModalModule,
  ],
})
export class ConfiguracaoUsuarioModule { }
