import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailUsuarioFupComponent } from './email-usuario/email-usuario-fup/email-usuario-fup.component';
import { EmailUsuarioParadaManutencaoComponent } from './email-usuario/email-usuario-parada-manutencao/email-usuario-parada-manutencao.component';
import { EmailUsuarioQmComponent } from './email-usuario/email-usuario-qm/email-usuario-qm.component';
import { EmailUsuarioZ1pzComponent } from './email-usuario/email-usuario-z1pz/email-usuario-z1pz.component';
import { FupComponent } from './fup/fup.component';
import { ImportacaoFupComponent } from './importacao-track/fup/importacao-fup';
import { ImportacaoParadaManutencaoComponent } from './importacao-track/parada-manutencao/importacao-parada-manutencao.component';
import { ImportacaoQmComponent } from './importacao-track/qm/importacao-qm.component';
import { ImportacaoZ1pzComponent } from './importacao-track/z1pz/importacao-z1pz.component';
import { ListePedidoTrackComponent } from './liste-pedido-track/liste-pedido-track.component';
import { ParadaManutencaoComponent } from './parada-manutencao/parada-manutencao.component';
import { QmComponent } from './qm/qm.component';
import { Z1pzComponent } from './z1pz/z1pz.component';

const routes: Routes = [
  {
    path: 'fup',
    component: FupComponent,
  },
  {
    path: 'fup/historico-importacao',
    component: ImportacaoFupComponent
  },
  {
    path: 'fup/historico-email',
    component: EmailUsuarioFupComponent,
  },
  {
    path: 'qm',
    component: QmComponent,
  },
  {
    path: 'qm/historico-importacao',
    component: ImportacaoQmComponent
  },
  {
    path: 'qm/historico-email',
    component: EmailUsuarioQmComponent,
  },
   {
    path: 'parada-manutencao',
    component: ParadaManutencaoComponent,
  },
  {
    path: 'parada-manutencao/historico-importacao',
    component: ImportacaoParadaManutencaoComponent
  },
  {
    path: 'parada-manutencao/historico-email',
    component: EmailUsuarioParadaManutencaoComponent,
  },
   {
    path: 'z1pz',
    component: Z1pzComponent,
  },
  {
    path: 'z1pz/historico-importacao',
    component: ImportacaoZ1pzComponent
  },
  {
    path: 'z1pz/historico-email',
    component: EmailUsuarioZ1pzComponent,
  },
  {
    path: 'liste-pedido-track',
    component: ListePedidoTrackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PedidoTrackRoutingModule { }
