import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NaturezaJuridicaRoutingModule } from './natureza-juridica-routing.module';
import { ListarNaturezasJuridicasComponent } from './listar-naturezas-juridicas/listar-naturezas-juridicas.component';
import { ManterNaturezaJuridicaComponent } from './manter-natureza-juridica/manter-natureza-juridica.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NaturezaJuridicaRoutingModule
  ],
  declarations: [ListarNaturezasJuridicasComponent, ManterNaturezaJuridicaComponent]
})

export class NaturezaJuridicaModule { }
