import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissaoAcompanhamentosGuard } from '@shared/guards/permissao-acompanhamentos.guard';
import { PermissaoIntegracaoSapGuard } from '@shared/guards/permissao-integracao-sap.guard';
import { PermissaoGuard } from '@shared/guards/permissao.guard';
import { ValidaTermoAceiteGuard } from '@shared/guards/valida-termo-aceite.guard';
import { PerfilUsuario } from '@shared/models';
import { RedirecionaPerfilInicialGuard } from '../../shared/guards/redirecionamento-inicial.guard';
import { ContratosFornecedorComponent } from '../contratos-fornecedor/contratos-fornecedor.component';
import { MarketplaceComponent } from '../marketplace/marketplace.component';
import { CarrinhoComponent } from './../catalogo/carrinho/carrinho.component';
import { ContainerComponent } from './container/container.component';

const routes: Routes = [
  {
    path: '',
    component: ContainerComponent,
    children: [
      {
        path: '',
        canActivate: [RedirecionaPerfilInicialGuard],
      },
      {
        path: 'dashboard',
        loadChildren: './../dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'acompanhamentos',
        loadChildren: './../acompanhamento/acompanhamento.module#AcompanhamentoModule',
        canActivate: [PermissaoGuard, PermissaoAcompanhamentosGuard, ValidaTermoAceiteGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Requisitante,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.Aprovador,
          ],
        },
      },
      // {
      //   path: 'bancos',
      //   loadChildren: './../banco/banco.module#BancoModule',
      //   canActivate: [PermissaoGuard],
      //   data: {permissoes: [PerfilUsuario.Administrador]}
      // },
      {
        path: 'campanhas-catalogo',
        loadChildren: './../campanha/campanha.module#CampanhaModule',
        canActivate: [PermissaoGuard],
        data: { permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor] },
      },
      {
        path: 'campanhas-franquia',
        loadChildren: './../campanha-franquia/campanha-franquia.module#CampanhaFranquiaModule',
        canActivate: [PermissaoGuard],
        data: { permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor] },
      },
      {
        path: 'condicoes-pagamento',
        loadChildren: './../condicao-pagamento/condicao-pagamento.module#CondicaoPagamentoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador],
        },
      },
      {
        path: 'carrinho',
        component: CarrinhoComponent,
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Requisitante,
          ],
        },
      },
      {
        path: 'contas-contabeis',
        loadChildren: './../conta-contabil/conta-contabil.module#ContaContabilModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador],
        },
      },
      {
        path: 'categorias-produto',
        loadChildren: './../categoria-produto/categoria-produto.module#CategoriaProdutoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'centros-custo',
        loadChildren: './../centro-custo/centro-custo.module#CentroCustoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador],
        },
      },
      {
        path: 'clientes',
        loadChildren: './../fornecedor-cliente/fornecedor-cliente.module#FornecedorClienteModule',
        canActivate: [PermissaoGuard, ValidaTermoAceiteGuard],
        data: { permissoes: [PerfilUsuario.Fornecedor] },
      },
      // {
      //   path: 'cnae',
      //   loadChildren: './../cnae/cnae.module#CnaeModule',
      //   canActivate: [PermissaoGuard],
      //   data: {permissoes: [PerfilUsuario.Administrador]}
      // },
      {
        path: 'contratos',
        loadChildren: './../contrato-catalogo/contrato-catalogo.module#ContratoCatalogoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador],
        },
      },
      {
        path: 'pdm-seller',
        loadChildren: './../pdm-seller/pdm-seller.module#PdmSellerModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador],
        },
      },
      {
        path: 'departamentos',
        loadChildren: './../departamento/departamento.module#DepartamentoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador],
        },
      },
      {
        path: 'empresas',
        loadChildren: './../pessoa-juridica/pessoa-juridica.module#PessoaJuridicaModule',
        canActivate: [PermissaoGuard, ValidaTermoAceiteGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.Comprador,
          ],
        },
      },
      {
        path: 'comprador',
        loadChildren: './../comprador/comprador.module#CompradorModule',
        canActivate: [PermissaoGuard, ValidaTermoAceiteGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Fornecedor,
            PerfilUsuario.Comprador,
          ],
        },
      },
      {
        path: 'fornecedores',
        loadChildren: './../fornecedor/fornecedor.module#FornecedorModule',
      },
      // {
      //   path: 'grupos-despesa',
      //   loadChildren: './../grupo-despesa/grupo-despesa.module#GrupoDespesaModule',
      //   canActivate: [PermissaoGuard],
      //   data: {permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor]}
      // },
      {
        path: 'importacoes',
        loadChildren: './../importacao/importacao.module#ImportacaoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador],
        },
      },
      {
        path: 'marcas',
        loadChildren: './../marca/marca.module#MarcaModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'marketplace',
        component: MarketplaceComponent,
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Requisitante,
            PerfilUsuario.Cadastrador,
          ],
        }
      },
      {
        path: 'contratos-fornecedor',
        component: ContratosFornecedorComponent,
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Fornecedor,
            PerfilUsuario.Administrador,
          ],
        },
      },
      {
        path: 'produtos-catalogo-fornecedor',
        loadChildren: './../produtos-catalogo-fornecedor/produtos-catalogo-fornecedor.module#ProdutosCatalogoFornecedorModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Fornecedor,
            PerfilUsuario.Administrador,
          ],
        },
      },
      // {
      //   path: 'naturezas-juridicas',
      //   loadChildren: './../natureza-juridica/natureza-juridica.module#NaturezaJuridicaModule',
      //   canActivate: [PermissaoGuard],
      //   data: {permissoes: [PerfilUsuario.Administrador]}
      // },
      {
        path: 'pedidos',
        loadChildren: './../pedido/pedido.module#PedidoModule',
        canActivate: [ValidaTermoAceiteGuard],
      },
      {
        path: 'pedidos-track',
        loadChildren: './../pedido-track/pedido-track.module#PedidoTrackModule',
        canActivate: [PermissaoGuard, ValidaTermoAceiteGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.RequisitanteTrack,
            PerfilUsuario.ConsultorTrack
          ]
        }
      },
      {
        path: 'produtos',
        loadChildren: './../produto/produto.module#ProdutoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'suporte',
        loadChildren: './../suporte/suporte.module#SuporteModule',
      },
      // {
      //   path: 'tipos-despesa',
      //   loadChildren: './../tipo-despesa/tipo-despesa.module#TipoDespesaModule',
      //   canActivate: [PermissaoGuard],
      //   data: {permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor]}
      // },
      {
        path: 'unidades-medida',
        loadChildren: './../unidade-medida/unidade-medida.module#UnidadeMedidaModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
          ],
        },
      },
      {
        path: 'usuarios',
        loadChildren: './../usuario/usuario.module#UsuarioModule',
        canActivate: [PermissaoGuard, ValidaTermoAceiteGuard],
        data: {
          permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Fornecedor],
        },
      },
      {
        path: 'configuracao-usuario',
        loadChildren: './configuracao-usuario/configuracao-usuario.module#ConfiguracaoUsuarioModule',
        canActivate: [PermissaoGuard, ValidaTermoAceiteGuard],
      },
      {
        path: 'solicitacao-produto',
        loadChildren:
          './../solicitacao-produto/solicitacao-produto.module#SolicitacaoProdutoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Cadastrador,
            PerfilUsuario.Requisitante,
          ],
        },
      },
      {
        path: 'solicitacao-cadastro-produto-servico',
        loadChildren:
          './../solicitacao-cadastro-produto-servico/solicitacao-cadastro-produto-servico.module#SolicitacaoCadastroProdutoServicoModule',
        canActivate: [PermissaoGuard],
        data: {
          permissoes: [
            PerfilUsuario.Administrador,
            PerfilUsuario.Gestor,
            PerfilUsuario.Comprador,
            PerfilUsuario.Requisitante,
          ],
        },
      },
      {
        path: 'configuracao-workflow',
        loadChildren:
          './../configuracao-workflow/configuracao-workflow.module#ConfiguracaoWorkflowModule',
        canActivate: [PermissaoGuard],
        data: { permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor] },
      },
      {
        path: 'configuracao-modulos',
        loadChildren:
          './../configuracao-modulos/configuracao-modulos.module#ConfiguracaoModulosModule',
        canActivate: [PermissaoGuard],
        data: { permissoes: [PerfilUsuario.Administrador] },
      },
      {
        path: 'parametros-integracao',
        loadChildren:
          './../parametros-integracao/parametros-integracao.module#ParametrosIntegracaoModule',
        canActivate: [PermissaoIntegracaoSapGuard],
        data: { permissoes: [PerfilUsuario.Administrador] },
      },
      {
        path: 'matriz-responsabilidade',
        loadChildren: './../matriz/matriz.module#MatrizModule',
        canActivate: [PermissaoGuard],
        data: { permissoes: [PerfilUsuario.Administrador, PerfilUsuario.Gestor] },
      },
      {
        path: 'relatorios',
        loadChildren: './../relatorios/relatorios.module#RelatoriosModule',
      },
      {
        path: 'alcada',
        loadChildren: './../alcada/alcada.module#AlcadaModule',
      },
      {
        path: 'mkp',
        loadChildren: './../marketplace/marketplace.module#MarketplaceModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContainerRoutingModule { }
