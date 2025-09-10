import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CnaeRoutingModule } from './cnae-routing.module';
import { ListarCnaesComponent } from './listar-cnaes/listar-cnaes.component';
import { CnaeComponent } from './cnae/cnae.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    CnaeRoutingModule,
    SharedModule
  ],
  declarations: [ListarCnaesComponent, CnaeComponent]
})

export class CnaeModule { }
