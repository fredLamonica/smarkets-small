import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { PerfilUsuario } from '@shared/models';
import { ListarCampanhaFranquiaComponent } from './listar-campanha-franquia/listar-campanha-franquia.component';
import { ManterCampanhaFranquiaComponent } from './manter-campanha-franquia/manter-campanha-franquia.component';
import { CriarCampanhaComponent } from './criar-campanha/criar-campanha.component';
import { UploadDeterminacaoVerbaComponent } from './upload-determinacao-verba/upload-determinacao-verba.component';
import { UploadPoliticaCampanhaComponent } from './upload-politica-campanha/upload-politica-campanha.component';
import { ListarCampanhaFranquiaFranquiadoComponent } from './listar-campanha-franquia-franquiado/listar-campanha-franquia-franquiado.component';
import { DetalheCampanhaFranquiaFranqueadoComponent } from './listar-campanha-franquia-franquiado/detalhe-campanha-franquia-franqueado/detalhe-campanha-franquia-franqueado.component';

const routes: Routes = [
  { path: '', component: ListarCampanhaFranquiaComponent },
  {path:'franqueado', component: ListarCampanhaFranquiaFranquiadoComponent},
  {path:'franqueado/:id', component: DetalheCampanhaFranquiaFranqueadoComponent},
  {
    path: 'novo',
    component: ManterCampanhaFranquiaComponent,
    children: [
      {
        path: 'dados-gerais',
        component: CriarCampanhaComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor]
        }
      }
    ]
  },
  {
    path: ':id',
    component: ManterCampanhaFranquiaComponent,
    children: [
      {
        path: 'dados-gerais',
        component: CriarCampanhaComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor]
        }
      },
      {
        path: 'politica-campanha',
        component: UploadPoliticaCampanhaComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor]
        }
      },
      {
        path: 'determinacao-verba',
        component: UploadDeterminacaoVerbaComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampanhaFranquiaRoutingModule {}
