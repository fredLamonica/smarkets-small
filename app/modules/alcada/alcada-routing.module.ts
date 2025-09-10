import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoGuard } from '../../shared/guards/permissao.guard';
import { PerfilUsuario } from '../../shared/models';
import { ListarAlcadasComponent } from './listar-alcadas/listar-alcadas.component';
import { ManterAlcadaComponent } from './manter-alcada/manter-alcada.component';

const routes: Routes = [
  {
    path: 'listar',
    component: ListarAlcadasComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Cadastrador,
        PerfilUsuario.Aprovador,
      ],
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'listar',
  },
  {
    path: 'novo',
    component: ManterAlcadaComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Cadastrador,
        PerfilUsuario.Aprovador,
      ],
    },
  },
  {
    path: ':idAlcada',
    component: ManterAlcadaComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Cadastrador,
        PerfilUsuario.Aprovador,
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlcadaRoutingModule { }
