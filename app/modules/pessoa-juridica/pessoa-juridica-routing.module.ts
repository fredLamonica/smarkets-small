import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { PerfilUsuario } from '@shared/models';
import { ListarPessoaJuridicaEscolhaComponent } from './listar-pessoa-juridica-escolha/listar-pessoa-juridica-escolha.component';
import { ManterPessoaJuridicaComponent } from './manter-pessoa-juridica/manter-pessoa-juridica.component';
import { ManterPlanoAcaoComponent } from './manter-plano-acao/manter-plano-acao.component';

const routes: Routes = [
  { path: '', component: ListarPessoaJuridicaEscolhaComponent },
  {
    path: 'novo',
    component: ManterPessoaJuridicaComponent,
    canActivate: [PermissaoGuard],
    data: { permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor] }
  },
  {
    path: 'novo/:idEmpresaCadastradora',
    component: ManterPessoaJuridicaComponent,
    canActivate: [PermissaoGuard],
    data: { permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor] }
  },
  { path: ':idPessoaJuridica', component: ManterPessoaJuridicaComponent, pathMatch: 'full' },
  { path: ':idPessoaJuridica/planoacao/:idPlanoAcao', component: ManterPlanoAcaoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PessoaJuridicaRoutingModule {}
