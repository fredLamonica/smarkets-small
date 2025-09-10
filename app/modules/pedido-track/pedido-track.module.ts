import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbCarouselModule, NgbModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
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
import { PedidoTrackRoutingModule } from './pedido-track-routing.module';
import { QmComponent } from './qm/qm.component';
import { ManterFupCamposComponent } from './track-campos/manter-fup-campos/manter-fup-campos.component';
import { ManterFupComponent } from './track-campos/manter-fup/manter-fup.component';
import { Z1pzComponent } from './z1pz/z1pz.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NgbTabsetModule,
    NgbCarouselModule,
    TextMaskModule,
    InfiniteScrollModule,
    NgbModule,
    PedidoTrackRoutingModule
  ],
  declarations: [
    FupComponent,
    QmComponent,
    ParadaManutencaoComponent,
    Z1pzComponent,
    ImportacaoZ1pzComponent,
    ImportacaoFupComponent,
    ImportacaoQmComponent,
    ImportacaoParadaManutencaoComponent,
    ManterFupComponent,
    ManterFupCamposComponent,
    EmailUsuarioFupComponent,
    EmailUsuarioParadaManutencaoComponent,
    EmailUsuarioQmComponent,
    EmailUsuarioZ1pzComponent,
    ListePedidoTrackComponent
  ],
  entryComponents: [
    ManterFupComponent,
    ManterFupCamposComponent,
  ],
  providers: [DatePipe],
})
export class PedidoTrackModule { }
