import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { TextMaskModule } from 'angular2-text-mask';
import { FornecedorClienteRoutingModule } from './fornecedor-cliente-routing.module';
import { ListarFornecedorClientesComponent } from './listar-fornecedor-clientes/listar-fornecedor-clientes.component';
import { ManterFornecedorClienteComponent } from './manter-fornecedor-cliente/manter-fornecedor-cliente.component';
import { PessoaJuridicaModule } from '../pessoa-juridica/pessoa-juridica.module';

@NgModule({
  imports: [
    CommonModule,
    FornecedorClienteRoutingModule,
    SharedModule,
    TextMaskModule,
    PessoaJuridicaModule,
  ],
  declarations: [ListarFornecedorClientesComponent, ManterFornecedorClienteComponent],
  entryComponents: [ListarFornecedorClientesComponent]
})
export class FornecedorClienteModule { }
