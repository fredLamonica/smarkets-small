import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MarcaRoutingModule } from "./marca-routing.module";
import { ListarMarcasComponent } from './listar-marcas/listar-marcas.component';
import { ManterMarcaComponent } from './manter-marca/manter-marca.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MarcaRoutingModule
  ],
  declarations: [ListarMarcasComponent, ManterMarcaComponent]
})
export class MarcaModule { }
