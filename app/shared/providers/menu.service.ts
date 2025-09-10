import { Injectable } from '@angular/core';
import { ItemMenu, PerfilUsuario, Usuario } from '@shared/models';
import { TipoAlcadaAprovacao } from '../models/enums/tipo-alcada-aprovacao';
import { Menu } from '../models/menu';
import { AutenticacaoService } from './autenticacao.service';

@Injectable()
export class MenuService {

  tipoAlcadaAprovacao: TipoAlcadaAprovacao;
  tipoAlcadaAprovacaoEnum = TipoAlcadaAprovacao;

  constructor(private authService: AutenticacaoService) { }

  obterMenu(): Menu {
    const perfil = this.authService.perfil();
    const usuario = this.authService.usuario();

    return new Menu({
      menuPrincipal: this.obterMenuPrincipalPorPermissao(perfil, usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao, usuario.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra),
      menuLateral: this.obterMenuLateralPorPermissao(perfil),
    });
  }

  // #endregion

  obterAcessoRapido(): ItemMenu[] {
    const perfil = this.authService.perfil();
    let menu = new Array<ItemMenu>();
    if (perfil) {
      switch (perfil) {
        case PerfilUsuario.Aprovador:
          menu = menu.concat(new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null));
          break;
        case PerfilUsuario.Requisitante:
          menu = menu.concat([
            new ItemMenu('Marketplace', 'fas fa-cart-arrow-down', '/marketplace', null, null),
            new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null),
          ]);
          break;
        case PerfilUsuario.Fornecedor:
          menu = menu.concat([
            new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null),
            new ItemMenu('Cotações', 'fas fa-file-contract', '/acompanhamentos', null, null),
          ]);
          break;
        case PerfilUsuario.Administrador:
          menu = menu.concat([
            new ItemMenu('Marketplace', 'fas fa-cart-arrow-down', '/marketplace', null, null),
            new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null),
            new ItemMenu('Contratos', 'far fa-handshake', '/contratos', null, null),
          ]);
          break;
        case PerfilUsuario.Comprador:
          menu = menu.concat([
            new ItemMenu('Marketplace', 'fas fa-cart-arrow-down', '/marketplace', null, null),
            new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null),
            new ItemMenu('Contratos', 'far fa-handshake', '/contratos', null, null),
          ]);
          break;
        case PerfilUsuario.Gestor:
          menu = menu.concat([
            new ItemMenu('Marketplace', 'fas fa-cart-arrow-down', '/marketplace', null, null),
            new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null),
            new ItemMenu('Contratos', 'far fa-handshake', '/contratos', null, null),
          ]);
          break;
        case PerfilUsuario.RequisitanteTrack:
          menu = menu.concat([
            new ItemMenu('Track', 'fas fa-truck-loading', '/pedidos-track/liste-pedido-track', null, null)
          ]);
          break;
        case PerfilUsuario.ConsultorTrack:
          menu = menu.concat([
            new ItemMenu('Track', 'fas fa-truck-loading', '/pedidos-track/liste-pedido-track', null, null)
          ]);
          break;
        default:
          menu = [];
          break;
      }
    }
    return menu;
  }

  private obterMenuPrincipalPorPermissao(perfil: PerfilUsuario, habilitarModuloCotacao: boolean, utilizaSolicitacaoCompra: boolean): Array<ItemMenu> {
    const menu = new Array<ItemMenu>();

    if (perfil) {
      if ([PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Comprador, PerfilUsuario.Requisitante, PerfilUsuario.Cadastrador].includes(perfil)) {
        menu.push(new ItemMenu('Marketplace', 'fas fa-cart-arrow-down', '/marketplace', null, null));
      }
      if ([PerfilUsuario.Fornecedor].includes(perfil)) {
        menu.push(new ItemMenu('Marketplace', 'fas fa-cart-arrow-down', '/contratos-fornecedor', null, null));
      }
      if(![PerfilUsuario.RequisitanteTrack, PerfilUsuario.ConsultorTrack].includes(perfil))
          menu.push(new ItemMenu('Dashboard', 'fas fa-chart-bar', '/', null, null));

      if ((habilitarModuloCotacao || utilizaSolicitacaoCompra) && ![PerfilUsuario.Cadastrador, PerfilUsuario.GestorDeFornecedores,
         PerfilUsuario.RequisitanteTrack, PerfilUsuario.ConsultorTrack].includes(perfil)) {
        menu.push(new ItemMenu('Acompanhamentos', 'fas fa-clipboard-list', '/acompanhamentos', null, null));
      }

      if ([PerfilUsuario.Administrador, PerfilUsuario.Comprador, PerfilUsuario.Gestor, PerfilUsuario.Requisitante, PerfilUsuario.Fornecedor, PerfilUsuario.Aprovador, PerfilUsuario.Recebimento].includes(perfil)) {
        menu.push(new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null));
      }

      if([PerfilUsuario.RequisitanteTrack, PerfilUsuario.ConsultorTrack].includes(perfil))
        menu.push(new ItemMenu('Track', 'fas fa-truck-loading', '/pedidos-track/liste-pedido-track', null, null))
    }

    return menu;
  }

  private obterMenuLateralPorPermissao(perfil: PerfilUsuario): Array<ItemMenu> {
    let menu = new Array<ItemMenu>();
    if (perfil) {
      switch (perfil) {
        case PerfilUsuario.Aprovador:
          menu = this.obterMenuAprovador(menu, perfil);
          break;
        case PerfilUsuario.Requisitante:
          menu = this.obterMenuRequisitante(menu, perfil);
          break;
        case PerfilUsuario.Fornecedor:
          menu = this.obterMenuFornecedor(menu, perfil);
          break;
        case PerfilUsuario.Administrador:
          menu = this.obterMenuAdministrador(menu, perfil);
          break;
        case PerfilUsuario.Comprador:
          menu = this.obterMenuComprador(menu, perfil);
          break;
        case PerfilUsuario.Gestor:
          menu = this.obterMenuGestor(menu, perfil);
          break;
        case PerfilUsuario.Cadastrador:
          menu = this.obterMenuCadastrador(menu, perfil);
          break;
        case PerfilUsuario.GestorDeFornecedores:
          menu = this.obterMenuGestorFornecedores(menu, perfil);
          break;
        case PerfilUsuario.Recebimento:
          menu = this.obterMenuRecebimento(menu, perfil);
          break;
        case PerfilUsuario.RequisitanteTrack:
          menu = this.obterMenuPerfil1(menu, perfil);
          break;
        case PerfilUsuario.ConsultorTrack:
          menu = this.obterMenuPerfil2(menu, perfil);
          break;
        default:
          menu = [];
          break;
      }
    }

    // Organizando os itens do menu em ordem alfabética
    menu.sort(function (a, b) {
      return a.nome.localeCompare(b.nome);
    });

    // Organizando os subitens de cada menu em ordem alfabética
    menu.forEach((item) => {
      item.subItens.sort(function (a, b) {
        return a.nome.localeCompare(b.nome);
      });
    });

    return menu;
  }

  // #region Por Perfil
  private obterMenuAdministrador(menu: Array<ItemMenu>, perfil: PerfilUsuario = null) {
    const usuario = this.authService.usuario();
    menu = menu
      .concat(this.obterMenuGestaoEmpresas(perfil))
      .concat(this.obterMenuGestaoProdutos(perfil, usuario));

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    menu = menu
      .concat(this.obterMenuGestaoContratos(perfil))
      .concat(this.obterMenuGestaoPedidos(perfil))
      .concat(this.obterMenuGestaoUsuarios())
      .concat(this.obterMenuGestaoTrack(perfil))
      .concat(this.obterMenuRelatorios(perfil))
      .concat(this.obterMenuImportacoes())
      .concat(this.obterMenuSuporte());

    return menu;
  }

  private adicioneSubitensMenuGestorDeFornecedor(subItensMenu: Array<ItemMenu>, menuFornecedoresBase: ItemMenu) {
    subItensMenu.push(
      new ItemMenu('Configurações', '', '/fornecedores/configuracoes', null, null),
    );

    if (menuFornecedoresBase) {
      subItensMenu.push(menuFornecedoresBase);
    }

    subItensMenu.push(
      new ItemMenu('Meus Fornecedores', '', '/fornecedores/local', null, null),
    );

    subItensMenu.push(
      new ItemMenu('Minhas Transportadoras', '', '/fornecedores/transportadoras', null, null),
    );

    subItensMenu.push(
      new ItemMenu('Avaliações', '', '/fornecedores/avaliacoes', null, null),
    );

    subItensMenu.push(
      new ItemMenu('Responder Avaliações', '', '/fornecedores/responderavaliacao', null, null),
    );

    subItensMenu.push(
      new ItemMenu(
        'Categorias de Fornecimento',
        '',
        '/fornecedores/categoriafornecimento',
        null,
        null,
      ),
    );
  }

  private obterMenuComprador(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();
    menu = menu
      .concat(this.obterMenuGestaoEmpresas(perfil))
      .concat(this.obterMenuGestaoProdutos(perfil, usuario));

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    menu = menu
      .concat(this.obterMenuGestaoContratos(perfil))
      .concat(this.obterMenuGestaoPedidos(perfil))
      .concat(this.obterMenuSuporte());

    if (usuario.permissaoAtual.pessoaJuridica.integracaoSapHabilitada || usuario.permissaoAtual.isSmarkets) {
      menu = menu.concat(this.obterMenuImportacoes());
    }

    return menu;
  }

  private obterMenuGestor(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();
    menu = menu
      .concat(this.obterMenuGestaoEmpresas(perfil))
      .concat(this.obterMenuGestaoProdutos(perfil, usuario));

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    menu = menu
      .concat(this.obterMenuGestaoContratos(perfil))
      .concat(this.obterMenuGestaoPedidos(perfil))
      .concat(this.obterMenuGestaoUsuarios())

    if(usuario.permissaoAtual.pessoaJuridica.habilitarTrack) {
      menu = menu.concat(this.obterMenuGestaoTrack(perfil))
    }

    menu = menu.concat(this.obterMenuRelatorios(perfil))
                .concat(this.obterMenuSuporte());

    if (usuario.permissaoAtual.pessoaJuridica.integracaoSapHabilitada || usuario.permissaoAtual.isSmarkets) {
      menu = menu.concat(this.obterMenuImportacoes());
    }

    return menu;
  }

  private obterMenuRequisitante(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();
    menu = menu
      .concat(this.obterMenuGestaoPedidos(perfil))
      .concat(this.obterMenuGestaoProdutos(perfil, usuario));

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    menu = menu.concat(this.obterMenuSuporte());

    return menu;
  }

  private obterMenuPerfil1(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    menu = menu.concat(this.obterMenuGestaoTrack(perfil))
               .concat(this.obterMenuSuporte());

    return menu;
  }

  private obterMenuPerfil2(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    menu = menu.concat(this.obterMenuGestaoTrack(perfil))
               .concat(this.obterMenuSuporte());

    return menu;
  }

  private obterMenuFornecedor(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();
    menu = menu
      .concat(this.obterMenuGestaoEmpresas(perfil))
      .concat(this.obterMenuGestaoUsuarios())
      .concat(this.obterMenuClientes())
      .concat(this.obterMenuGestaoPedidos(perfil))
      .concat(this.obterMenuRelatorios(perfil))
      ;

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    menu = menu.concat(this.obterMenuSuporte());

    return menu;
  }

  private obterMenuCadastrador(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();
    menu = menu.concat(this.obterMenuGestaoEmpresas(perfil)).concat(this.obterMenuGestaoProdutos(perfil, usuario)).concat(this.obterMenuSuporte());

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    return menu;
  }

  private obterMenuGestorFornecedores(
    menu: Array<ItemMenu>,
    perfil: PerfilUsuario = null,
  ): ItemMenu[] {
    const usuario = this.authService.usuario();

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu
        .concat(this.obterMenuGestaoFornecedores(perfil))
        .concat(this.obterMenuGestaoPedidos(perfil));
    }

    menu = menu.concat(this.obterMenuSuporte());
    return menu;
  }

  private obterMenuAprovador(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();
    menu = menu.concat(this.obterMenuGestaoEmpresas(perfil)).concat(this.obterMenuGestaoPedidos(perfil));

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    return menu;
  }

  private obterMenuRecebimento(menu: Array<ItemMenu>, perfil: PerfilUsuario = null): ItemMenu[] {
    const usuario = this.authService.usuario();

    menu = menu.concat(this.obterMenuGestaoPedidos(perfil));

    if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      menu = menu.concat(this.obterMenuGestaoFornecedores(perfil));
    }

    return menu;
  }

  // #endregion

  //#region Por Menu
  private obterMenuGestaoEmpresas(perfil: PerfilUsuario): ItemMenu {
    const usuario = this.authService.usuario();
    const permissaoAtual = this.authService.usuario().permissaoAtual;
    const itemMenuEmpresas = new ItemMenu('Empresas', 'fa fa-industry', '/comprador', null, null);
    const itemMenuCentrosCusto = new ItemMenu('Centros de Custo', 'fas fa-dollar-sign', '/centros-custo', null, null);
    const itemMenuDepartamentos = new ItemMenu('Departamentos', 'fas fa-project-diagram', '/departamentos', null, null);
    const itemMenuAlcadas = new ItemMenu('Alçada de Aprovação', 'fas fa-gavel', '/alcada/listar', null, null);
    const habilitaAlcadaUnificada = usuario.permissaoAtual.pessoaJuridica.tipoAlcadaAprovacao === this.tipoAlcadaAprovacaoEnum.unificada;

    if (perfil) {
      let menu = null;
      if (perfil === PerfilUsuario.Fornecedor) {
        menu = new ItemMenu(
          'Meu Cadastro',
          'fa fa-industry',
          '/comprador',
          null,
          new Array<ItemMenu>(),
        );
      } else {
        menu = new ItemMenu(
          'Gestão de Empresas',
          'fa fa-industry',
          '/comprador',
          null,
          new Array<ItemMenu>(),
        );
      }

      switch (perfil) {
        case PerfilUsuario.Fornecedor:
          menu.subItens = menu.subItens.concat(
            new ItemMenu(
              'Dados Gerais',
              'fa fa-industry',
              `/fornecedores/novo/${usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica}/dados-gerais`,
              null,
              null,
            ),
            new ItemMenu(
              'Meus Documentos',
              'far fa-file-alt',
              `/fornecedores/novo/${usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica}/documentos`,
              null,
              null,
            ),
            new ItemMenu(
              'Minhas Pendências',
              'far fa-clipboard',
              `/fornecedores/novo/${usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica}/pendencias`,
              null,
              null,
            ),
            new ItemMenu(
              'Meus Planos de Ação',
              'fas fa-directions',
              `/fornecedores/novo/${usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica}/planos-acao`,
              null,
              null,
            ),
            new ItemMenu(
              'Meus Questionários',
              'fas fa-question',
              `/fornecedores/novo/${usuario.permissaoAtual.pessoaJuridica.idPessoaJuridica}/questionarios`,
              null,
              null,
            ),
          );
          break;
        case PerfilUsuario.Comprador:
          menu.subItens = menu.subItens.concat(
            itemMenuEmpresas,
            itemMenuCentrosCusto,
            itemMenuDepartamentos,
          );

          menu.subItens = menu.subItens.concat(
            new ItemMenu('Contas Contábeis', 'fas fa-money-bill', '/contas-contabeis', null, null),
            new ItemMenu('Condições de Pagamento', 'fas fa-money-check-alt', '/condicoes-pagamento', null, null),
          );
          break;
        case PerfilUsuario.Gestor:
        case PerfilUsuario.Administrador:
          const utilizaParametrosIntegracaoSap = usuario.permissaoAtual.pessoaJuridica.parametrosIntegracaoSapHabilitado;

          menu.subItens = menu.subItens.concat(itemMenuEmpresas);

          if (habilitaAlcadaUnificada) {
            menu.subItens = menu.subItens.concat(itemMenuAlcadas);
          }

          menu.subItens = menu.subItens.concat(
            itemMenuCentrosCusto,
            itemMenuDepartamentos,
          );

          menu.subItens = menu.subItens.concat(
            new ItemMenu('Contas Contábeis', 'fas fa-money-bill', '/contas-contabeis', null, null),
            new ItemMenu('Condições de Pagamento', 'fas fa-money-check-alt', '/condicoes-pagamento', null, null),
            new ItemMenu('Configurar Workflow', 'fa fa-network-wired', '/configuracao-workflow', null, null));

          if (utilizaParametrosIntegracaoSap) {
            menu.subItens = menu.subItens.concat(
              new ItemMenu('Parâmetros de Integração', 'fa fa-link', '/parametros-integracao', null, null));
          }

          if (perfil === PerfilUsuario.Administrador) {
            menu.subItens = menu.subItens.concat(
              new ItemMenu('Configurar Módulos', 'fas fa-cogs', '/configuracao-modulos', null, null),
            );
          }

          if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao) {
            menu.subItens = menu.subItens.concat(
              new ItemMenu('Matriz de Responsabilidade', 'fa fa-table', '/matriz-responsabilidade', null, null));
          }

          if ((permissaoAtual.pessoaJuridica.holding || permissaoAtual.isSmarkets) && (permissaoAtual.perfil === 1 || permissaoAtual.perfil === 6)) {
            menu.subItens = menu.subItens.concat(new ItemMenu('Solic. de Cadastro (SLA)', 'fas fa-clipboard-list', '/solicitacao-cadastro-produto-servico', null, null));
          }

          break;
        case PerfilUsuario.Cadastrador:
        case PerfilUsuario.Aprovador:

          if (habilitaAlcadaUnificada) {
            menu.subItens = menu.subItens.concat(itemMenuAlcadas);
          }

          break;
        default:
          menu = null;
          break;
      }
      return menu;
    }
  }

  private obterMenuGestaoProdutos(perfil: PerfilUsuario, usuario: Usuario): ItemMenu {
    if (perfil) {
      let menu = new ItemMenu(
        'Gestão de Produtos',
        'fas fa-box-open',
        '/produtos',
        null,
        new Array<ItemMenu>(),
      );
      switch (perfil) {
        case PerfilUsuario.Requisitante:
          menu.subItens = menu.subItens.concat(
            new ItemMenu(
              'Solicitação de Cadastro',
              'fas fa-clipboard-list',
              '/solicitacao-produto',
              null,
              null,
            ),
          );
          break;
        case PerfilUsuario.Comprador:
          menu.subItens = menu.subItens.concat(
            new ItemMenu(
              'Solicitação de Cadastro',
              'fas fa-clipboard-list',
              '/solicitacao-produto',
              null,
              null,
            ),
          );
          break;
        case PerfilUsuario.Gestor:
        case PerfilUsuario.Administrador:
        case PerfilUsuario.Cadastrador:
          if (perfil !== PerfilUsuario.Administrador && !usuario.permissaoAtual.isSmarkets) {
            let nomeMenuProdutosDaBase = 'Produtos ';

            if (!usuario.permissaoAtual.pessoaJuridica.holding && usuario.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai) {
              nomeMenuProdutosDaBase += 'da Holding';
            } else {
              nomeMenuProdutosDaBase += 'Smarkets';
            }

            menu.subItens.push(new ItemMenu(nomeMenuProdutosDaBase, 'fas fa-box', '/produtos/base', null, null));
          }

          menu.subItens = menu.subItens.concat(
            new ItemMenu('Meus Produtos', 'fas fa-box-open', '/produtos', null, null),
            new ItemMenu('Categorias de Produto', 'fas fa-sitemap', '/categorias-produto', null, null),
            new ItemMenu('Marcas', 'fas fa-trademark', '/marcas', null, null),
            new ItemMenu('Unidades de Medida', 'fas fa-ruler-combined', '/unidades-medida', null, null),
            new ItemMenu('Solicitação de Cadastro', 'fas fa-clipboard-list', '/solicitacao-produto', null, null),

          );

          if(perfil == PerfilUsuario.Administrador)
            menu.subItens.push(new ItemMenu('Saneamento', 'fas fa-fill-drip', '/pdm-seller', null, null));

          break;

        default:
          menu = null;
          break;
      }
      return menu;
    }
  }

  private obterItemMenuFornecedoresBase(): ItemMenu {
    const permissaoAtual = this.authService.usuario().permissaoAtual;

    const isFilialHolding =
      permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai &&
      permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai !==
      permissaoAtual.pessoaJuridica.idPessoaJuridica;

    let itemMenuFornecedores: ItemMenu;

    if (isFilialHolding) {
      itemMenuFornecedores = new ItemMenu(
        'Fornecedores da Holding',
        '',
        '/fornecedores/holding',
        null,
        null,
      );
    } else if (!permissaoAtual.isSmarkets) {
      itemMenuFornecedores = new ItemMenu(
        'Fornecedores Smarkets',
        '',
        '/fornecedores/smarkets',
        null,
        null,
      );
    }

    return itemMenuFornecedores;
  }

  private obterMenuGestaoFornecedores(perfil): ItemMenu {
    const habilitarModuloFornecedores =
      this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarModuloFornecedores;

    const fornecedoresBase = this.obterItemMenuFornecedoresBase();

    if (perfil && habilitarModuloFornecedores) {
      const menu = new ItemMenu(
        'Gestão de Fornecedores',
        'fas fa-people-carry',
        null,
        null,
        new Array<ItemMenu>(),
      );

      switch (perfil) {
        case PerfilUsuario.Comprador:

          menu.subItens.push(
            new ItemMenu('Responder Avaliações', '', '/fornecedores/responderavaliacao', null, null),
            new ItemMenu('Solicitação Cadastro', 'fas fa-clipboard-list', '/fornecedores/solicitacao-cadastro-fornecedor', null, null),
          );
          break;

        case PerfilUsuario.Gestor:
          menu.subItens.push(
            new ItemMenu('Configurações', '', '/fornecedores/configuracoes', null, null),
          );

          if (fornecedoresBase) {
            menu.subItens.push(fornecedoresBase);
          }

          menu.subItens.push(
            new ItemMenu('Meus Fornecedores', '', '/fornecedores/local', null, null),
            new ItemMenu('Minhas Transportadoras', '', '/fornecedores/transportadoras', null, null),
            new ItemMenu('Responder Avaliações', '', '/fornecedores/responderavaliacao', null, null),
            new ItemMenu('Categorias de Fornecimento', '', '/fornecedores/categoriafornecimento', null, null),
            new ItemMenu('Solicitação Cadastro', 'fas fa-clipboard-list', '/fornecedores/solicitacao-cadastro-fornecedor', null, null),
          );

          break;

        case PerfilUsuario.Administrador:
          this.adicioneSubitensMenuGestorDeFornecedor(menu.subItens, fornecedoresBase);

          menu.subItens.push(
            new ItemMenu('Solicitação Cadastro', 'fas fa-clipboard-list', '/fornecedores/solicitacao-cadastro-fornecedor', null, null),
          );

          break;

        case PerfilUsuario.GestorDeFornecedores:

          this.adicioneSubitensMenuGestorDeFornecedor(menu.subItens, fornecedoresBase);
          break;

        case PerfilUsuario.Requisitante:

          menu.subItens.push(new ItemMenu('Solicitação Cadastro', 'fas fa-clipboard-list', '/fornecedores/solicitacao-cadastro-fornecedor', null, null));
          break;

        case PerfilUsuario.Cadastrador:

          if (fornecedoresBase) {
            menu.subItens.push(fornecedoresBase);
          }

          menu.subItens.push(
            new ItemMenu('Meus Fornecedores', '', '/fornecedores/local', null, null),
            new ItemMenu('Minhas Transportadoras', '', '/fornecedores/transportadoras', null, null),
            new ItemMenu('Categorias de Fornecimento', '', '/fornecedores/categoriafornecimento', null, null),
            new ItemMenu('Solicitação Cadastro', 'fas fa-clipboard-list', '/fornecedores/solicitacao-cadastro-fornecedor', null, null),
          );

          break;
        default:
          menu.subItens = menu.subItens.concat(
            new ItemMenu('Responder Avaliações', '', '/fornecedores/responderavaliacao', null, null),
          );
          break;
      }
      return menu;
    }
  }

  private obterMenuGestaoPedidos(perfil): ItemMenu {
    const usuario = this.authService.usuario();
    const habilitarModuloCotacao = usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao;
    const utilizaSolicitacaoCompra = usuario.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra;
    const empresaLogadaUtilizaIntegracaoErp = usuario.permissaoAtual.pessoaJuridica.habilitarIntegracaoERP;

    const menu = new ItemMenu('Gestão de Pedidos', 'fa fa-tags', null, null, new Array<ItemMenu>());

    if (PerfilUsuario.Fornecedor !== perfil) {
      if (PerfilUsuario.Administrador === perfil || PerfilUsuario.GestorDeFornecedores === perfil || PerfilUsuario.Gestor === perfil) {
        menu.subItens = menu.subItens.concat(
          new ItemMenu(
            'Configurações',
            'fas fa-cogs',
            '/pedidos/configuracoespedido/configuracoes',
            null,
            null,
          ),
        );
      }

      if (
        utilizaSolicitacaoCompra &&
        (perfil === PerfilUsuario.Requisitante ||
          perfil === PerfilUsuario.Gestor ||
          perfil === PerfilUsuario.Comprador ||
          perfil === PerfilUsuario.Administrador)
      ) {
        menu.subItens = menu.subItens.concat(
          new ItemMenu(
            'Acompanhamentos',
            'fas fa-chart-line',
            '/acompanhamentos',
            { aba: 'acompanhamentos' },
            null,
          ),
        );
      }

      if (utilizaSolicitacaoCompra && PerfilUsuario.Aprovador !== perfil) {
        menu.subItens = menu.subItens.concat(
          new ItemMenu(
            'Solicitações',
            'fas fa-business-time',
            '/acompanhamentos',
            { aba: 'solicitacoes-compra' },
            null,
          ),
        );
      }

      if (habilitarModuloCotacao) {
        menu.subItens = menu.subItens.concat(
          new ItemMenu('Requisições', 'fas fa-file-alt', '/acompanhamentos/requisicoes', null, null),
        );
      }
    }

    if (
      habilitarModuloCotacao &&
      ![PerfilUsuario.Aprovador, PerfilUsuario.Requisitante].includes(perfil)
    ) {
      menu.subItens = menu.subItens.concat(
        new ItemMenu(
          'Cotações',
          'fas fa-file-contract',
          '/acompanhamentos',
          { aba: 'cotacoes' },
          null,
        ),
      );
    }

    if (PerfilUsuario.GestorDeFornecedores !== perfil) {
      menu.subItens = menu.subItens.concat(
        new ItemMenu('Pedidos', 'fa fa-tags', '/pedidos', null, null),
      );
    }

    if (empresaLogadaUtilizaIntegracaoErp && (perfil === PerfilUsuario.Gestor || perfil === PerfilUsuario.Requisitante || perfil === PerfilUsuario.Comprador)) {
      menu.subItens = menu.subItens.concat(
        new ItemMenu('Requisição ERP', 'fa fa-cog', '/pedidos/requisicoes-erp', null, null),
      );
    }

    return menu;
  }

  private obterMenuGestaoContratos(perfil: PerfilUsuario): ItemMenu {
    const pessoaJuridicaLogada = this.authService.usuario().permissaoAtual.pessoaJuridica;
    const menu = new ItemMenu('Gestão de Contratos', 'far fa-handshake', null, null, []);

    if ([PerfilUsuario.Gestor, PerfilUsuario.Administrador].includes(perfil)) {
      menu.subItens.push(new ItemMenu('Campanhas', 'fas fa-ad', '/campanhas-catalogo', null, null));
    }

    if (
      [PerfilUsuario.Gestor, PerfilUsuario.Administrador].includes(perfil) &&
      (pessoaJuridicaLogada.franquia ||
        (pessoaJuridicaLogada.holding && pessoaJuridicaLogada.hasFranchise))
    ) {
      menu.subItens.push(
        new ItemMenu('Campanhas Franquias', 'fas fa-ad',
          pessoaJuridicaLogada.franquia ? '/campanhas-franquia/franqueado' :
            '/campanhas-franquia',
          null,
          null),
      );
    }

    menu.subItens.push(new ItemMenu('Contratos', 'far fa-handshake', '/contratos', null, null));

    return menu;
  }

   private obterMenuGestaoTrack(perfil: PerfilUsuario): ItemMenu {
    const pessoaJuridicaLogada = this.authService.usuario().permissaoAtual.pessoaJuridica;

    const menu = new ItemMenu('Gestão de Track', 'fas fa-truck-loading', null, null, []);

    if([PerfilUsuario.RequisitanteTrack, PerfilUsuario.ConsultorTrack, PerfilUsuario.Administrador].includes(perfil))
      menu.subItens.push(new ItemMenu('Track', '', 'pedidos-track/liste-pedido-track', null, null));

    if(![PerfilUsuario.RequisitanteTrack, PerfilUsuario.ConsultorTrack].includes(perfil)){
        if(pessoaJuridicaLogada.habilitarFup)
          menu.subItens.push(new ItemMenu('FUP', '', 'pedidos-track/fup', null, null));

        if(pessoaJuridicaLogada.habilitarQm)
          menu.subItens.push(new ItemMenu('QM', '', 'pedidos-track/qm', null, null));

        if(pessoaJuridicaLogada.habilitarParadaManutencao)
          menu.subItens.push(new ItemMenu('Parada Manutenção', '', 'pedidos-track/parada-manutencao', null, null));

        if(pessoaJuridicaLogada.habilitarZ1pz)
          menu.subItens.push(new ItemMenu('Z1PZ', '', 'pedidos-track/z1pz', null, null));
    }

    return menu;
  }

  private obterMenuGestaoUsuarios(): ItemMenu {
    return new ItemMenu('Gestão de Usuários', 'fa fa-users', '/usuarios', null, [
      new ItemMenu('Usuários', 'fa fa-users', '/usuarios', null, null),
    ]);
  }

  private obterMenuClientes(): ItemMenu {
    return new ItemMenu('Empresas Clientes', 'fas fa-industry', null, null, [
      new ItemMenu('Empresas Clientes', 'fas fa-industry', '/clientes', null, null),
    ]);
  }

  private obterMenuSuporte(): ItemMenu {
    return new ItemMenu('Políticas', 'fas fa-user-check', null, null, [
      new ItemMenu('Política de Privacidade ', 'fas fa-user-shield', '/suporte/download-politica-privacidade', null, null),
    ]);
  }

  private obterMenuRelatorios(perfil: PerfilUsuario): ItemMenu {

    let menu: ItemMenu;

    if ([PerfilUsuario.Administrador, PerfilUsuario.Gestor].includes(perfil)) {
      const usuario = this.authService.usuario();
      const menuRelatorioDeAprovacoes: ItemMenu = new ItemMenu('Aprovações', 'fa fa-table', '/relatorios/historico-aprovacao', null, null);
      const menuRelatorioDePedidos: ItemMenu = new ItemMenu('Pedidos', 'fa fa-table', '/relatorios/historico-pedidos', null, null);
      const menuRelatorioDeRequisicoes: ItemMenu = new ItemMenu('Requisições', 'fa fa-table', '/relatorios/relatorio-requisicao', null, null);

      if (usuario.permissaoAtual.pessoaJuridica.habilitarModuloCotacao) {
        menu = new ItemMenu('Relatórios', 'fa fa-download', null, null, [
          new ItemMenu('Acessos de Fornecedores', 'fa fa-table', '/relatorios/acessaram-plataforma', null, null),
          menuRelatorioDeAprovacoes,
          new ItemMenu('Participações em Cotações', 'fa fa-table', '/relatorios/participacao-cotacao', null, null),
          menuRelatorioDePedidos,
          menuRelatorioDeRequisicoes,
        ]);
      } else {
        menu = new ItemMenu('Relatórios', 'fa fa-download', null, null, [
          menuRelatorioDeAprovacoes,
          menuRelatorioDePedidos,
          menuRelatorioDeRequisicoes,
        ]);
      }

      if (usuario.permissaoAtual.pessoaJuridica.utilizaSolicitacaoCompra) {
        menu.subItens.push(
          new ItemMenu('Solicitações', 'fa fa-table', '/relatorios/solicitacao-compra', null, null),
        );
      }
    }

    if (perfil === PerfilUsuario.Fornecedor) {
      menu = new ItemMenu('Relatórios', 'fa fa-download', null, null, [
        new ItemMenu('Catalogos', 'fa fa-table', '/relatorios/catalogos-fornecedor', null, null),
      ]);
    }

    return menu;
  }

  private obterMenuImportacoes(): ItemMenu {
    const usuario = this.authService.usuario();
    const menu = new ItemMenu('Importações', 'fas fa-upload', null, null, new Array<ItemMenu>());
    // const itemMenuClientes = new ItemMenu('Carga de Clientes', null, '/importacoes/carga-cliente', null, null);

    if (usuario.permissaoAtual.pessoaJuridica.integracaoSapHabilitada) {
      menu.subItens.push(
        new ItemMenu('Solicitações de Compra', null, '/importacoes/solicitacao-compra', null, null),
      );
    }

    if (usuario.permissaoAtual.isSmarkets && usuario.permissaoAtual.perfil === 1) {
      menu.subItens.push(
        // new ItemMenu('Carga de Clientes', null, '/importacoes/carga-cliente', null, null),
        new ItemMenu('Condições de Pagamento', null, '/importacoes/carga-condicao-pagamento', null, null),
        new ItemMenu('Contratos', null, '/importacoes/carga-informacao-contratos', null, null),
        new ItemMenu('Empresas', null, '/importacoes/carga-empresa', null, null),
        new ItemMenu('Fornecedores', null, '/importacoes/carga-fornecedor', null, null),
        new ItemMenu('Imagens de Produtos', null, '/importacoes/carga-imagem', null, null),
        new ItemMenu('Modelos de Importação', null, '/importacoes/uploads-modelos-importacao', null, null),
        new ItemMenu('Precificação I.A', null, '/importacoes/carga-precificacao-produto-ia', null, null),
        new ItemMenu('Produtos', null, '/importacoes/carga-produto', null, null),
        new ItemMenu('Produtos I.A', null, '/importacoes/carga-produto-ia', null, null),
        new ItemMenu('Usuários', null, '/importacoes/carga-usuario', null, null),
      );
    }

    return menu;
  }
}
