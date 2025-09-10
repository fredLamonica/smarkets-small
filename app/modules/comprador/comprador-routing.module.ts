import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { PerfilUsuario } from '@shared/models';
import { ListarPessoaJuridicaEscolhaComponent } from '../pessoa-juridica/listar-pessoa-juridica-escolha/listar-pessoa-juridica-escolha.component';
import { CnaesCompradorComponent } from './cnaes-comprador/cnaes-comprador.component';
import { DadosGeraisCompradorComponent } from './dados-gerais-comprador/dados-gerais-comprador.component';
import { InformacoesBancariasCompradorComponent } from './informacoes-bancarias-comprador/informacoes-bancarias-comprador.component';
import { EnderecoCompradorComponent } from './endereco-comprador/endereco-comprador.component';
import { ManterCompradorComponent } from './manter-comprador/manter-comprador.component';
import { UsuariosCompradorComponent } from './usuarios-comprador/usuarios-comprador.component';

const routes: Routes = [
  { path: '', component: ListarPessoaJuridicaEscolhaComponent },

  {
    path: 'novo',
    component: ManterCompradorComponent,
    children: [
      {
        path: 'dados-gerais',
        component: DadosGeraisCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      },
      {
        path: ':idPessoaJuridicaMatriz/dados-gerais',
        component: DadosGeraisCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      }
    ]
  },
  {
    path: ':id',
    component: ManterCompradorComponent,
    // redirectTo: ':id/dados-gerais',
    children: [
      {
        path: 'dados-gerais',
        component: DadosGeraisCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      },
      {
        path: 'usuarios',
        component: UsuariosCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      },
      {
        path: 'enderecos',
        component: EnderecoCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      },
      {
        path: 'domicilios-bancarios',
        component: InformacoesBancariasCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      },
      {
        path: 'cnaes',
        component: CnaesCompradorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompradorRoutingModule {}
