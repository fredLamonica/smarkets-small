import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartamentoRoutingModule } from './departamento-routing.module';
import { ListarDepartamentosComponent } from './listar-departamentos/listar-departamentos.component';
import { ManterDepartamentoComponent } from './manter-departamento/manter-departamento.component';
import { SharedModule } from '@shared/shared.module';
import { TreeModule } from 'angular-tree-component';
import { ListarNiveisComponent } from './niveis/listar-niveis/listar-niveis.component';
import { ManterNivelComponent } from './niveis/manter-nivel/manter-nivel.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ListarNiveisParticipantesComponent } from './niveis/nivel-participante/listar-niveis-participantes/listar-niveis-participantes.component';
import { ManterNivelParticipanteComponent } from './niveis/nivel-participante/manter-nivel-participante/manter-nivel-participante.component';

@NgModule({
  imports: [
    CommonModule,
    DepartamentoRoutingModule,
    SharedModule,
    TreeModule.forRoot(),
    TextMaskModule
  ],
  entryComponents: [ ManterNivelComponent, ManterNivelParticipanteComponent ],
  declarations: [ListarDepartamentosComponent, ManterDepartamentoComponent, ListarNiveisComponent, ManterNivelComponent, ListarNiveisParticipantesComponent, ManterNivelParticipanteComponent]
})
export class DepartamentoModule { }
