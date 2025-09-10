import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarUnidadesMedidaComponent } from './listar-unidades-medida/listar-unidades-medida.component';
import { ManterUnidadeMedidaComponent } from './manter-unidade-medida/manter-unidade-medida.component';

const routes: Routes = [
  { path: "", component: ListarUnidadesMedidaComponent },
  { path: "novo", component: ManterUnidadeMedidaComponent },
  { path: ":idUnidadeMedida", component: ManterUnidadeMedidaComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadeMedidaRoutingModule { }
