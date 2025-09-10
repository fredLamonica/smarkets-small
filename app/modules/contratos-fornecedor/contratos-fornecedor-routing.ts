import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratosFornecedorComponent } from './contratos-fornecedor.component';

const routes: Routes = [
{ path: '', component: ContratosFornecedorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratosFornecedorRoutingModule { }
