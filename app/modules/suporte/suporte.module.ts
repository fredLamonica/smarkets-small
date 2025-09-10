import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuporteRoutingModule } from './suporte-routing.module';
import { ContatoComponent } from './contato/contato.component';
import { TreinamentoComponent } from './treinamento/treinamento.component';
import { SharedModule } from '@shared/shared.module';
import { DownloadPoliticaPrivacidadeComponent } from './download-politica-privacidade/download-politica-privacidade.component';
import {FormularioComponent} from './contato/formulario/formulario.component'

@NgModule({
  imports: [CommonModule, SuporteRoutingModule, SharedModule],
  declarations: [ContatoComponent, TreinamentoComponent, DownloadPoliticaPrivacidadeComponent, FormularioComponent]
})
export class SuporteModule {}
