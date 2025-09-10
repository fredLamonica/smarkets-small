import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CampanhaRoutingModule } from './campanha-routing.module';
import { ListarCampanhasComponent } from './listar-campanhas/listar-campanhas.component';
import { ManterCampanhaComponent } from './manter-campanha/manter-campanha.component';
import { SharedModule } from '@shared/shared.module';
import { NgbModalModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SelecionarContratosCatalogoComponent } from './selecionar-contratos-catalogo/selecionar-contratos-catalogo.component';

@NgModule({
  declarations: [ListarCampanhasComponent, ManterCampanhaComponent, SelecionarContratosCatalogoComponent],
  imports: [
    CommonModule,
    CampanhaRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    NgbModalModule,
    NgbDatepickerModule,
    TextMaskModule
  ],
  entryComponents: [
    SelecionarContratosCatalogoComponent
  ]
})
export class CampanhaModule { }
