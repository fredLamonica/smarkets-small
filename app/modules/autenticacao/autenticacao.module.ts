import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AutenticacaoRoutingModule } from './autenticacao-routing.module';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '@shared/shared.module';
import { PoliticaPrivacidadeComponent } from './politica-privacidade/politica-privacidade.component';

@NgModule({
  imports: [CommonModule, AutenticacaoRoutingModule, SharedModule],
  declarations: [
    RecuperarSenhaComponent,
    RedefinirSenhaComponent,
    LoginComponent,
    PoliticaPrivacidadeComponent
  ],
  entryComponents: [PoliticaPrivacidadeComponent]
})
export class AutenticacaoModule {}
