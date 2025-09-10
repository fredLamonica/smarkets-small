import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartaDeResponsabilidadeComponent, EnderecoComponent } from '@shared/components';
import { SdkCnaeComponent } from '@shared/components/sdk-cnae/sdk-cnae.component';
import { SdkDomicilioBancarioComponent } from '@shared/components/sdk-domicilio-bancario/sdk-domicilio-bancario.component';
import { PermissaoGestaoFornecedoresGuard } from '@shared/guards/permissao-gestao-fornecedores.guard';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { PerfilUsuario } from '@shared/models';
import { ManterIntegracoesErpComponent } from '../../shared/components/manter-integracoes-erp/manter-integracoes-erp.component';
import { TipoIntegracaoErp } from '../../shared/models/enums/tipo-integracao-erp';
import { ManterUsuarioFornecedorComponent } from '../usuario/manter-usuario-fornecedor/manter-usuario-fornecedor.component';
import { ListarAvaliacaoFornecedorComponent } from './avaliacao-fornecedor/listar-avaliacao-fornecedor/listar-avaliacao-fornecedor.component';
import { ManterAvaliacaoFornecedorComponent } from './avaliacao-fornecedor/manter-avaliacao-fornecedor/manter-avaliacao-fornecedor.component';
import { DadosGeraisComponent } from './dados-gerais/dados-gerais.component';
import { ListarDisparoAvaliacaoFornecedorComponent } from './disparo-avaliacao-fornecedor/listar-disparo-avaliacao-fornecedor/listar-disparo-avaliacao-fornecedor.component';
import { ListarResultadoAvaliacaoFornecedorComponent } from './disparo-avaliacao-fornecedor/listar-resultado-avaliacao-fornecedor/listar-resultado-avaliacao-fornecedor.component';
import { DocumentosFornecedorComponent } from './documentos-fornecedor/documentos-fornecedor.component';
import { ListarConfiguracaoVisitaTecnicaComponent } from './gestao-fornecedor/configuracoes-fornecedor/configuracao-visita-tecnica/listar-configuracao-visita-tecnica/listar-configuracao-visita-tecnica.component';
import { ManterConfiguracaoAvaliacaoFornecedorComponent } from './gestao-fornecedor/configuracoes-fornecedor/manter-configuracao-avaliacao-fornecedor/manter-configuracao-avaliacao-fornecedor.component';
import { GestaoFornecedorComponent } from './gestao-fornecedor/gestao-fornecedor/gestao-fornecedor.component';
import { ManterQuestionariosGestaoFornecedorComponent } from './gestao-fornecedor/questionarios-fornecedor/manter-questionario-gestao-fornecedor/manter-questionarios-gestao-fornecedor.component';
import { DocumentosFornecedorClienteComponent } from './manter-fornecedor-admin/documentos-fornecedor-cliente/documentos-fornecedor-cliente.component';
import { ManterFornecedorAdminComponent } from './manter-fornecedor-admin/manter-fornecedor-admin.component';
import { ManterFornecedorNovoComponent } from './manter-fornecedor-novo/manter-fornecedor-novo.component';
import { PendenciasAdminComponent } from './pendencias-admin/pendencias-admin.component';
import { PendenciasComponent } from './pendencias/pendencias.component';
import { PlanoAcaoAdminComponent } from './plano-acao-admin/plano-acao-admin.component';
import { PlanosAcaoFornecedorComponent } from './planos-acao-fornecedor/planos-acao-fornecedor.component';
import { QuestionariosAdminComponent } from './questionarios-admin/questionarios-admin.component';
import { QuestionariosComponent } from './questionarios/questionarios.component';
import { RedeFornecedoraComponent } from './rede-fornecedora/rede-fornecedora.component';
import { ListarSolicitacaoCadastroFornecedorComponent } from './solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor/listar-solicitacao-cadastro-fornecedor.component';
import {
  DadosGeraisSolicitacaoCadastroFornecedorComponent
} from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/dados-gerais-solicitacao-cadastro-fornecedor/dados-gerais-solicitacao-cadastro-fornecedor.component';
import {
  EnderecosSolicitacaoCadastroFornecedorComponent
} from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/enderecos-solicitacao-cadastro-fornecedor/enderecos-solicitacao-cadastro-fornecedor.component';
import { ManterSolicitacaoCadastroFornecedorComponent } from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor.component';
import { UsuariosComponent } from './solicitacao-cadastro-fornecedor/manter-solicitacao-cadastro-fornecedor/usuarios/usuarios.component';
import { KeepSupplyCathegoryComponent } from './supply-cathegory/keep-supply-cathegory/keep-supply-cathegory.component';
import { ListSupplyCathegoryComponent } from './supply-cathegory/list-supply-cathegory/list-supply-cathegory.component';
import { ListarTransportadoraComponent } from './transportadora/listar-transportadora/listar-transportadora.component';
import { ManterTransportadoraPessoaJuridicaComponent } from './transportadora/manter-transportadora-pessoa-juridica/manter-transportadora-pessoa-juridica.component';
import { ManterTransportadoraComponent } from './transportadora/manter-transportadora/manter-transportadora.component';
import { VisitaTecnicaAdminComponent } from './visita-tecnica-admin/visita-tecnica-admin.component';
import { ManterResultadoVisitaTecnicaComponent } from './visita-tecnica/manter-resultado-visita-tecnica/manter-resultado-visita-tecnica.component';

const routes: Routes = [
  {
    path: 'avaliacoes',
    component: ListarAvaliacaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'avaliacoes/nova',
    component: ManterAvaliacaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'avaliacoes/:idAvaliacaoFornecedor',
    component: ManterAvaliacaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'avaliacoes/:idAvaliacaoFornecedor/disparos',
    component: ListarDisparoAvaliacaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'avaliacoes/:idAvaliacaoFornecedor/respostas',
    component: ListarResultadoAvaliacaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  { path: 'responderavaliacao', component: ListarResultadoAvaliacaoFornecedorComponent },
  {
    path: 'categoriafornecimento',
    component: ListSupplyCathegoryComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'categoriafornecimento/nova',
    component: KeepSupplyCathegoryComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'categoriafornecimento/:idCategoriaFornecimento',
    component: KeepSupplyCathegoryComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'solicitacao-cadastro-fornecedor',
    component: ListarSolicitacaoCadastroFornecedorComponent,
    canActivate: [PermissaoGuard],
    pathMatch: 'full',
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Requisitante,
        PerfilUsuario.Comprador,
        PerfilUsuario.Cadastrador,
      ],
    },

  },
  {
    path: 'manter-solicitacao-fornecedor',
    component: ManterSolicitacaoCadastroFornecedorComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Requisitante,
        PerfilUsuario.Comprador,
        PerfilUsuario.Cadastrador,
      ],
    },
    children: [
      {
        path: 'dados-gerais/:id',
        component: DadosGeraisSolicitacaoCadastroFornecedorComponent,
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Requisitante,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'enderecos/:id',
        component: EnderecosSolicitacaoCadastroFornecedorComponent,
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Requisitante,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'usuarios/:id',
        component: UsuariosComponent,
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Requisitante,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
    ],
  },
  {
    path: 'configuracoes',
    component: GestaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
      ],
    },
  },
  {
    path: 'configuracoes/visitatecnica',
    component: ListarConfiguracaoVisitaTecnicaComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'configuracoes/parametrosavaliacao',
    component: ManterConfiguracaoAvaliacaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
      ],
    },
  },
  {
    path: 'configuracoes/questionario/:idQuestionarioGestaoFornecedor',
    component: ManterQuestionariosGestaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
      ],
    },
  },
  {
    path: 'configuracoes/questionario/novo',
    component: ManterQuestionariosGestaoFornecedorComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
      ],
    },
  },
  {
    path: 'transportadoras',
    component: ListarTransportadoraComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'transportadoras/nova',
    component: ManterTransportadoraPessoaJuridicaComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'transportadoras/:idTransportadora',
    component: ManterTransportadoraComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: ':tipo',
    component: RedeFornecedoraComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.Comprador,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: ':tipo/visitatecnica/:idVisitaTecnica',
    component: ManterResultadoVisitaTecnicaComponent,
    canActivate: [PermissaoGuard, PermissaoGestaoFornecedoresGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },
  },
  {
    path: 'novo/:id',
    component: ManterFornecedorNovoComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Fornecedor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },

    children: [
      {
        path: 'dados-gerais',
        component: DadosGeraisComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'enderecos',
        component: EnderecoComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'domicilios-bancarios',
        component: SdkDomicilioBancarioComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'cnaes',
        component: SdkCnaeComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'documentos',
        component: DocumentosFornecedorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'pendencias',
        component: PendenciasComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'planos-acao',
        component: PlanosAcaoFornecedorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'questionarios',
        component: QuestionariosComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Fornecedor, PerfilUsuario.Cadastrador],
        },
      },
      {
        path: 'usuarios',
        component: ManterUsuarioFornecedorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
    ],
  },
  {
    path: 'local/novo',
    component: ManterFornecedorAdminComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario['Gestor de Fornecedores'],
        PerfilUsuario.Cadastrador,
      ],
    },

    children: [
      {
        path: 'dados-gerais',
        component: DadosGeraisComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
    ],
  },
  {
    path: ':tipo/:id',
    component: ManterFornecedorAdminComponent,
    canActivate: [PermissaoGuard],
    data: {
      permissoes: [
        PerfilUsuario.Administrador,
        PerfilUsuario.Gestor,
        PerfilUsuario.GestorDeFornecedores,
        PerfilUsuario.Cadastrador,
      ],
    },

    children: [
      {
        path: 'dados-gerais/:idTenantFornecedor',
        component: DadosGeraisComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'enderecos/:idTenantFornecedor',
        component: EnderecoComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'domicilios-bancarios/:idTenantFornecedor',
        component: SdkDomicilioBancarioComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'cnaes/:idTenantFornecedor',
        component: SdkCnaeComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'integracao-erp/:idTenantFornecedor',
        component: ManterIntegracoesErpComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          tipoIntegracaoErp: TipoIntegracaoErp.fornecedor,
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'documentos/:idTenantFornecedor',
        component: DocumentosFornecedorClienteComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'pendencias/:idTenantFornecedor',
        component: PendenciasAdminComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'planos-acao/:idTenantFornecedor',
        component: PlanoAcaoAdminComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'questionarios/:idTenantFornecedor',
        component: QuestionariosAdminComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'usuarios/:idTenantFornecedor',
        component: ManterUsuarioFornecedorComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'visita-tecnica/:idTenantFornecedor',
        component: VisitaTecnicaAdminComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'cartas-responsabilidade/:idTenantFornecedor',
        component: CartaDeResponsabilidadeComponent,
        canActivate: [PermissaoGuard],
        pathMatch: 'full',
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.GestorDeFornecedores,
            PerfilUsuario.Gestor,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FornecedorRoutingModule { }
