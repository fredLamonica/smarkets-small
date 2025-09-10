import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManterCampanhaFranquiaComponent } from './manter-campanha-franquia/manter-campanha-franquia.component';
import { SharedModule } from '@shared/shared.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { CampanhaFranquiaRoutingModule } from './campanha-franquia-routing.module';
import { ListarCampanhaFranquiaComponent } from './listar-campanha-franquia/listar-campanha-franquia.component';
import { CriarCampanhaComponent } from './criar-campanha/criar-campanha.component';
import { UploadPoliticaCampanhaComponent } from './upload-politica-campanha/upload-politica-campanha.component';
import { UploadDeterminacaoVerbaComponent } from './upload-determinacao-verba/upload-determinacao-verba.component';
import { ItemCampanhaFranquiaComponent } from './item-campanha-franquia/item-campanha-franquia.component';
import { ListarCampanhaFranquiaFranquiadoComponent } from './listar-campanha-franquia-franquiado/listar-campanha-franquia-franquiado.component';
import { ItemCampanhaFranquiaFranqueadoComponent } from './listar-campanha-franquia-franquiado/item-campanha-franquia-franqueado/item-campanha-franquia-franqueado.component';
import { DetalheCampanhaFranquiaFranqueadoComponent } from './listar-campanha-franquia-franquiado/detalhe-campanha-franquia-franqueado/detalhe-campanha-franquia-franqueado.component';

@NgModule({
  declarations: [
    ManterCampanhaFranquiaComponent,
    ListarCampanhaFranquiaComponent,
    UploadPoliticaCampanhaComponent,
    UploadDeterminacaoVerbaComponent,
    CriarCampanhaComponent,
    ItemCampanhaFranquiaComponent,
    ListarCampanhaFranquiaFranquiadoComponent,
    ItemCampanhaFranquiaFranqueadoComponent,
    DetalheCampanhaFranquiaFranqueadoComponent
  ],
  imports: [
    CommonModule,
    CampanhaFranquiaRoutingModule,
    SharedModule,
    InfiniteScrollModule,
    NgbModalModule,
    NgbDatepickerModule,
    TextMaskModule
  ],
  entryComponents: []
})
export class CampanhaFranquiaModule {}
