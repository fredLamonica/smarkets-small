import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { BancoRoutingModule } from "./banco-routing.module";
import { ListarBancosComponent } from './listar-bancos/listar-bancos.component';
import { ManterBancoComponent } from './manter-banco/manter-banco.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BancoRoutingModule
  ],
  declarations: [ListarBancosComponent, ManterBancoComponent]
})
export class BancoModule { }
