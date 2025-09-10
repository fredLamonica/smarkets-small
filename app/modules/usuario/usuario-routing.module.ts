import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { ManterUsuarioComponent } from './manter-usuario/manter-usuario.component';

const routes: Routes = [
  { path: "", component: ListaUsuariosComponent },
  { path: "novo", component: ManterUsuarioComponent },
  { path: ":idUsuario", component: ManterUsuarioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
