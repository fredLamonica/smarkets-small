import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoDespesaRoutingModule } from './grupo-despesa-routing.module';
import { SharedModule } from '@shared/shared.module';
import { ListarGruposDespesaComponent } from './listar-grupos-despesa/listar-grupos-despesa.component';
import { ManterGrupoDespesaComponent } from './manter-grupo-despesa/manter-grupo-despesa.component';

@NgModule({
  imports: [
    CommonModule,    
    SharedModule,
    GrupoDespesaRoutingModule
  ],
  declarations: [ListarGruposDespesaComponent, ManterGrupoDespesaComponent]
})
export class GrupoDespesaModule { }
