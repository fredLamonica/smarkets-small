import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FornecedorInteressadoRoutingModule } from './fornecedor-interessado-routing.module';
import { RegistrarInteresseComponent } from './registrar-interesse/registrar-interesse.component';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  imports: [
    CommonModule,
    FornecedorInteressadoRoutingModule,
    SharedModule,
    TextMaskModule
  ],
  declarations: [RegistrarInteresseComponent]
})
export class FornecedorInteressadoModule { }
