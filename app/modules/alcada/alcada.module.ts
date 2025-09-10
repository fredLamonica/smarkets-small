import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AlcadaRoutingModule } from './alcada-routing.module';
import { ItemAlcadaComponent } from './listar-alcadas/item-alcada/item-alcada.component';
import { ListarAlcadasComponent } from './listar-alcadas/listar-alcadas.component';
import { ManterAlcadaComponent } from './manter-alcada/manter-alcada.component';
import { ModalAlcadaNivelComponent } from './modal-alcada-nivel/modal-alcada-nivel.component';
import { ModalAlcadaUsuarioComponent } from './modal-alcada-usuario/modal-alcada-usuario.component';

@NgModule({
  declarations: [ListarAlcadasComponent, ItemAlcadaComponent, ManterAlcadaComponent, ModalAlcadaNivelComponent, ModalAlcadaUsuarioComponent],
  imports: [
    CommonModule,
    AlcadaRoutingModule,
    SharedModule,
  ],
  exports: [ItemAlcadaComponent],
  entryComponents: [ManterAlcadaComponent, ModalAlcadaNivelComponent, ModalAlcadaUsuarioComponent],
})
export class AlcadaModule { }
