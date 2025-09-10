import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MockDataService } from '../services/mock/mock-data.service';

@Injectable()
export class MockInterceptor implements HttpInterceptor {

  constructor(private mockDataService: MockDataService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Verificar se é uma requisição para API que deve ser mockada
    if (this.shouldMock(req.url)) {
      return this.handleMockRequest(req);
    }

    // Para requisições não mockadas, continuar normalmente
    return next.handle(req);
  }

  private shouldMock(url: string): boolean {
    // Lista de URLs que devem ser mockadas
    const mockUrls = [
      '/api/auth',
      '/api/produtos',
      '/api/catalogo',
      '/api/requisicoes',
      '/api/cotacoes',
      '/api/contratos',
      '/api/pedidos',
      '/api/fornecedores',
      '/api/carrinho',
      '/api/dashboard',
      '/api/configuracoes',
      '/api/solicitacoes-compra'
    ];

    return mockUrls.some(mockUrl => url.includes(mockUrl));
  }

  private handleMockRequest(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const url = req.url;
    const method = req.method;

    // Roteamento das requisições mockadas
    if (url.includes('/api/auth/login')) {
      return this.mockLogin(req.body);
    }

    if (url.includes('/api/produtos/catalogo')) {
      return this.mockResponse(this.mockDataService.getProdutosCatalogo());
    }

    if (url.includes('/api/produtos/requisicao')) {
      return this.mockResponse(this.mockDataService.getProdutosRequisicao());
    }

    if (url.includes('/api/carrinho/resumo')) {
      return this.mockResponse(this.mockDataService.getCarrinhoResumo());
    }

    if (url.includes('/api/carrinho/itens')) {
      return this.mockResponse(this.mockDataService.getCarrinhoItens());
    }

    if (url.includes('/api/cotacoes')) {
      return this.mockResponse(this.mockDataService.getCotacoes());
    }

    if (url.includes('/api/contratos')) {
      return this.mockResponse(this.mockDataService.getContratos());
    }

    if (url.includes('/api/pedidos')) {
      return this.mockResponse(this.mockDataService.getPedidos());
    }

    if (url.includes('/api/fornecedores')) {
      return this.mockResponse(this.mockDataService.getFornecedores());
    }

    if (url.includes('/api/dashboard')) {
      return this.mockResponse(this.mockDataService.getDashboardData());
    }

    if (url.includes('/api/solicitacoes-compra')) {
      return this.mockResponse(this.mockDataService.getSolicitacoesCompra());
    }

    if (url.includes('/api/estados')) {
      return this.mockResponse(this.mockDataService.getEstados());
    }

    if (url.includes('/api/categorias')) {
      return this.mockResponse(this.mockDataService.getCategorias());
    }

    if (url.includes('/api/marcas')) {
      return this.mockResponse(this.mockDataService.getMarcas());
    }

    if (url.includes('/api/enderecos')) {
      return this.mockResponse(this.mockDataService.getEnderecos());
    }

    if (url.includes('/api/centros-custo')) {
      return this.mockResponse(this.mockDataService.getCentrosCusto());
    }

    if (url.includes('/api/condicoes-pagamento')) {
      return this.mockResponse(this.mockDataService.getCondicoesPagamento());
    }

    if (url.includes('/api/configuracoes')) {
      return this.mockResponse(this.mockDataService.getConfiguracoes());
    }

    // Para métodos POST/PUT/DELETE, simular sucesso
    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      return this.mockSuccessResponse();
    }

    // Resposta padrão para URLs não mapeadas
    return this.mockResponse(of({ message: 'Mock response', data: [] }));
  }

  private mockLogin(credentials: any): Observable<HttpEvent<any>> {
    return of(new HttpResponse({
      status: 200,
      body: {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          idUsuario: 1,
          email: credentials.identificador || 'usuario@smarkets.com',
          pessoaFisica: {
            nome: 'João Silva'
          },
          permissaoAtual: {
            idTenant: 1,
            perfil: 1,
            pessoaJuridica: {
              idPessoaJuridica: 1,
              cnpj: '12.345.678/0001-90',
              razaoSocial: 'Empresa Teste LTDA',
              nomeFantasia: 'Empresa Teste'
            }
          }
        }
      }
    })).pipe(delay(1000));
  }

  private mockResponse(dataObservable: Observable<any>): Observable<HttpEvent<any>> {
    return dataObservable.pipe(
      map(data => new HttpResponse({
        status: 200,
        body: data
      }))
    );
  }

  private mockSuccessResponse(): Observable<HttpEvent<any>> {
    return of(new HttpResponse({
      status: 200,
      body: { success: true, message: 'Operação realizada com sucesso' }
    })).pipe(delay(500));
  }
}