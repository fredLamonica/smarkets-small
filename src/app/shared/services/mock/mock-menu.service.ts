import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockMenuService {

  getMenu(): Observable<any> {
    const mockMenu = {
      menuPrincipal: [
        {
          nome: 'Dashboard',
          rota: '/dashboard',
          icone: 'fas fa-tachometer-alt'
        },
        {
          nome: 'Marketplace',
          rota: '/marketplace',
          icone: 'fas fa-store'
        },
        {
          nome: 'Carrinho',
          rota: '/carrinho',
          icone: 'fas fa-shopping-cart'
        },
        {
          nome: 'Cotações',
          rota: '/cotacoes',
          icone: 'fas fa-file-invoice'
        }
      ],
      menuLateral: [
        {
          nome: 'Compras',
          icone: 'fas fa-shopping-bag',
          subItens: [
            {
              nome: 'Pedidos',
              rota: '/pedidos',
              icone: 'fas fa-file-alt'
            },
            {
              nome: 'Requisições',
              rota: '/requisicoes',
              icone: 'fas fa-clipboard-list'
            },
            {
              nome: 'Solicitações de Compra',
              rota: '/solicitacoes-compra',
              icone: 'fas fa-file-invoice'
            }
          ]
        },
        {
          nome: 'Contratos',
          icone: 'fas fa-handshake',
          subItens: [
            {
              nome: 'Contratos de Catálogo',
              rota: '/contratos-catalogo',
              icone: 'fas fa-file-contract'
            },
            {
              nome: 'Contratos Fornecedor',
              rota: '/contratos-fornecedor',
              icone: 'fas fa-user-tie'
            }
          ]
        },
        {
          nome: 'Fornecedores',
          icone: 'fas fa-truck',
          subItens: [
            {
              nome: 'Listar Fornecedores',
              rota: '/fornecedores',
              icone: 'fas fa-list'
            },
            {
              nome: 'Homologação',
              rota: '/fornecedores/homologacao',
              icone: 'fas fa-check-circle'
            }
          ]
        },
        {
          nome: 'Configurações',
          icone: 'fas fa-cog',
          subItens: [
            {
              nome: 'Módulos',
              rota: '/configuracao-modulos',
              icone: 'fas fa-puzzle-piece'
            },
            {
              nome: 'Workflow',
              rota: '/configuracao-workflow',
              icone: 'fas fa-project-diagram'
            },
            {
              nome: 'Parâmetros Integração',
              rota: '/parametros-integracao',
              icone: 'fas fa-link'
            },
            {
              nome: 'Matriz Responsabilidade',
              rota: '/matriz-responsabilidade',
              icone: 'fas fa-users-cog'
            }
          ]
        },
        {
          nome: 'Área do Usuário',
          icone: 'fas fa-user',
          subItens: [
            {
              nome: 'Informações Pessoais',
              rota: '/area-usuario/informacoes-pessoais',
              icone: 'fas fa-id-card'
            },
            {
              nome: 'Histórico de Compras',
              rota: '/area-usuario/historico-compras',
              icone: 'fas fa-history'
            },
            {
              nome: 'Produtos Favoritos',
              rota: '/area-usuario/produtos-favoritos',
              icone: 'fas fa-heart'
            },
            {
              nome: 'Notificações',
              rota: '/area-usuario/notificacoes',
              icone: 'fas fa-bell'
            }
          ]
        }
      ]
    };

    return of(mockMenu).pipe(delay(300));
  }

  getAcessoRapido(): Observable<any[]> {
    const mockAcessoRapido = [
      {
        nome: 'Nova Cotação',
        rota: '/cotacoes/nova',
        icone: 'fas fa-plus'
      },
      {
        nome: 'Novo Contrato',
        rota: '/contratos-catalogo/novo',
        icone: 'fas fa-file-plus'
      },
      {
        nome: 'Solicitar Produto',
        rota: '/solicitacao-produto/nova',
        icone: 'fas fa-box'
      }
    ];

    return of(mockAcessoRapido).pipe(delay(200));
  }
}