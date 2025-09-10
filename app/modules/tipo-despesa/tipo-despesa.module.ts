import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TipoDespesaRoutingModule } from './tipo-despesa-routing.module';
import { ListarTiposDepesaComponent } from './listar-tipos-depesa/listar-tipos-depesa.component';
import { ManterTipoDepesaComponent } from './manter-tipo-depesa/manter-tipo-depesa.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TipoDespesaRoutingModule
  ],
  declarations: [ListarTiposDepesaComponent, ManterTipoDepesaComponent]
})
export class TipoDespesaModule { }
