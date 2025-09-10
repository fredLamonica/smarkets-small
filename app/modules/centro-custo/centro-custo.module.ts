import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentroCustoRoutingModule } from './centro-custo-routing.module';
import { ListarCentrosCustoComponent } from './listar-centros-custo/listar-centros-custo.component';
import { ManterCentroCustoComponent } from './manter-centro-custo/manter-centro-custo.component';
import { SharedModule } from '@shared/shared.module';
import { TreeModule } from 'angular-tree-component';
import { ListarAlcadasCentroCustoComponent } from './alcadas-centro-custo/listar-alcadas-centro-custo/listar-alcadas-centro-custo.component';
import { ManterAlcadaCentroCustoComponent } from './alcadas-centro-custo/manter-alcada-centro-custo/manter-alcada-centro-custo.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    CentroCustoRoutingModule,
    SharedModule,
    TreeModule.forRoot(),
    TextMaskModule
  ],
  entryComponents: [ ManterAlcadaCentroCustoComponent ],
  declarations: [ListarCentrosCustoComponent, ManterCentroCustoComponent, ListarAlcadasCentroCustoComponent, ManterAlcadaCentroCustoComponent]
})
export class CentroCustoModule { }
