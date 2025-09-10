import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListarBancosComponent } from './listar-bancos/listar-bancos.component';
import { ManterBancoComponent } from './manter-banco/manter-banco.component';

const routes: Routes = [
    { path: "", component: ListarBancosComponent },
    { path: "novo", component: ManterBancoComponent },
    { path: ":idBanco", component: ManterBancoComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BancoRoutingModule { }
