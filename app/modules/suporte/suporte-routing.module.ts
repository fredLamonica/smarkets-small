import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TreinamentoComponent } from './treinamento/treinamento.component';
import { ContatoComponent } from './contato/contato.component';
import { DownloadPoliticaPrivacidadeComponent } from './download-politica-privacidade/download-politica-privacidade.component';

const routes: Routes = [
  { path: 'contato', component: ContatoComponent },
  { path: 'download-politica-privacidade', component: DownloadPoliticaPrivacidadeComponent }
  // { path: 'treinamento', component: TreinamentoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuporteRoutingModule {}
