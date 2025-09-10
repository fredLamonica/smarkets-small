import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarTaxasImpostosComponent } from './listar-taxas-impostos/listar-taxas-impostos.component';
import { ManterTaxaImpostoComponent } from './manter-taxa-imposto/manter-taxa-imposto.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ListarTaxasImpostosComponent, ManterTaxaImpostoComponent]
})
export class TaxaImpostoModule { }
