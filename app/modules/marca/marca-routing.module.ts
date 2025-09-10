import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarMarcasComponent } from './listar-marcas/listar-marcas.component';
import { ManterMarcaComponent } from './manter-marca/manter-marca.component';

const routes: Routes = [
    { path: "", component: ListarMarcasComponent },
    { path: "novo", component: ManterMarcaComponent },
    { path: ":idMarca", component: ManterMarcaComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class MarcaRoutingModule { }
