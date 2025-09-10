import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AreaUsuarioComponent } from './area-usuario/area-usuario.component';
import { HistoricoComprasComponent } from './historico-compras/historico-compras.component';
import { InformacoesPessoaisGuard } from './informacoes-pessoais/guards/informacoes-pessoais.guard';
import { InformacoesPessoaisComponent } from './informacoes-pessoais/informacoes-pessoais.component';
import { NotificacoesComponent } from './notificacoes/notificacoes.component';
import { ProdutosFavoritosComponent } from './produtos-favoritos/produtos-favoritos.component';

const routes: Routes = [
  { path: '', component: AreaUsuarioComponent },
  { path: 'informacoes-pessoais', component: InformacoesPessoaisComponent, canDeactivate: [InformacoesPessoaisGuard] },
  { path: 'favoritos', component: ProdutosFavoritosComponent },
  { path: 'historico-compras', component: HistoricoComprasComponent },
  { path: 'notificacoes', component: NotificacoesComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracaoUsuarioRoutingModule { }
