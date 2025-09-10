import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DadosFornecedorRoutingModule } from './dados-fornecedor-routing.module';
import { ManterDocumentosFornecedorComponent } from './documentos-fornecedor/manter-documentos-fornecedor/manter-documentos-fornecedor.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ManterDocumentosFornecedorComponent],
  imports: [
    CommonModule,
    DadosFornecedorRoutingModule,
    SharedModule
  ],
  entryComponents:[
    ManterDocumentosFornecedorComponent
  ]
})
export class DadosFornecedorModule { }
