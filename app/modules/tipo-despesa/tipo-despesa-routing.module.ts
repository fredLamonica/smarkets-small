import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManterTipoDepesaComponent } from './manter-tipo-depesa/manter-tipo-depesa.component';
import { ListarTiposDepesaComponent } from './listar-tipos-depesa/listar-tipos-depesa.component';

const routes: Routes = [
  { path: "", component: ListarTiposDepesaComponent },
  { path: "novo", component: ManterTipoDepesaComponent },
  { path: ":idTipo", component: ManterTipoDepesaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipoDespesaRoutingModule { }
