import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadeMedidaRoutingModule } from './unidade-medida-routing.module';
import { ListarUnidadesMedidaComponent } from './listar-unidades-medida/listar-unidades-medida.component';
import { ManterUnidadeMedidaComponent } from './manter-unidade-medida/manter-unidade-medida.component';
import { SharedModule } from '@shared/shared.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    UnidadeMedidaRoutingModule,
    SharedModule,
    NgbModalModule,
    InfiniteScrollModule
  ],
  entryComponents: [
    ManterUnidadeMedidaComponent
  ],
  declarations: [ListarUnidadesMedidaComponent, ManterUnidadeMedidaComponent]
})
export class UnidadeMedidaModule { }
