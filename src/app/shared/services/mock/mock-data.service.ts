import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private currentUser = new BehaviorSubject(null);
  private carrinhoItems = new BehaviorSubject([]);
  private notificacoes = new BehaviorSubject([]);

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Simular usuário logado
    const mockUser = {
      idUsuario: 1,
      email: 'usuario@smarkets.com',
      pessoaFisica: {
        nome: 'João Silva',
        telefone: '(11) 99999-9999',
        celular: '(11) 88888-8888',
        ramal: '1234'
      },
      permissaoAtual: {
        idTenant: 1,
        perfil: 1, // Gestor
        pessoaJuridica: {
          idPessoaJuridica: 1,
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Empresa Teste LTDA',
          nomeFantasia: 'Empresa Teste',
          logo: null,
          configuracaoDash: 1,
          habilitarIntegracaoERP: true,
          habilitarModuloCotacao: true,
          habilitarRegularizacao: true,
          habilitarImobilizado: true,
          habilitarMFA: false
        }
      },
      permissoes: [
        {
          idTenant: 1,
          perfil: 1,
          pessoaJuridica: {
            idPessoaJuridica: 1,
            cnpj: '12.345.678/0001-90',
            razaoSocial: 'Empresa Teste LTDA',
            nomeFantasia: 'Empresa Teste'
          }
        }
      ]
    };

    this.currentUser.next(mockUser);

    // Simular itens do carrinho
    const mockCarrinho = [
      {
        idPedido: 1,
        fornecedor: {
          idPessoaJuridica: 1,
          cnpj: '98.765.432/0001-10',
          razaoSocial: 'Fornecedor ABC LTDA',
          nomeFantasia: 'Fornecedor ABC'
        },
        itens: [
          {
            idPedidoItem: 1,
            produto: {
              idProduto: 1,
              descricao: 'Notebook Dell Inspiron 15',
              imagens: [{ url: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg' }],
              unidadeMedida: { sigla: 'UN' }
            },
            quantidade: 2,
            valor: 2500.00,
            moeda: 1
          }
        ]
      }
    ];

    this.carrinhoItems.next(mockCarrinho);

    // Simular notificações
    const mockNotificacoes = [
      {
        idNotificacao: 1,
        titulo: 'Pedido Aprovado',
        mensagem: 'Seu pedido #12345 foi aprovado',
        dataCriacao: new Date(),
        situacao: 1
      },
      {
        idNotificacao: 2,
        titulo: 'Nova Cotação',
        mensagem: 'Nova cotação disponível para análise',
        dataCriacao: new Date(Date.now() - 86400000),
        situacao: 2
      }
    ];

    this.notificacoes.next(mockNotificacoes);
  }

  // Métodos para autenticação
  login(credentials: any): Observable<any> {
    return of({
      success: true,
      token: 'mock-jwt-token',
      user: this.currentUser.value
    }).pipe(delay(1000));
  }

  getCurrentUser(): Observable<any> {
    return this.currentUser.asObservable();
  }

  // Métodos para produtos/catálogo
  getProdutosCatalogo(filtros?: any): Observable<any> {
    const mockProdutos = Array.from({ length: 20 }, (_, i) => ({
      idContratoCatalogoItem: i + 1,
      tipo: 1, // Catálogo
      contratoCatalogoItem: {
        idContratoCatalogoItem: i + 1,
        valor: Math.random() * 1000 + 100,
        moeda: 1,
        loteMinimo: 1,
        prazoEntrega: Math.floor(Math.random() * 30) + 1,
        frete: Math.floor(Math.random() * 4) + 1,
        tipoCatalogo: Math.random() > 0.5 ? 1 : 2,
        produto: {
          idProduto: i + 1,
          descricao: `Produto ${i + 1} - ${this.getRandomProductName()}`,
          imagens: [{ url: this.getRandomProductImage() }],
          unidadeMedida: { sigla: 'UN' },
          categoria: { nome: this.getRandomCategory() }
        },
        fornecedor: {
          idPessoaJuridica: i + 1,
          cnpj: this.generateRandomCNPJ(),
          razaoSocial: `Fornecedor ${i + 1} LTDA`,
          nomeFantasia: `Fornecedor ${i + 1}`
        },
        marca: Math.random() > 0.3 ? { nome: this.getRandomBrand() } : null
      }
    }));

    return of({
      itens: mockProdutos,
      totalPaginas: 5,
      paginaAtual: 1
    }).pipe(delay(500));
  }

  // Métodos para requisições
  getProdutosRequisicao(filtros?: any): Observable<any> {
    const mockProdutos = Array.from({ length: 15 }, (_, i) => ({
      idProduto: i + 1,
      tipo: 2, // Requisição
      produto: {
        idProduto: i + 1,
        descricao: `Produto Requisição ${i + 1} - ${this.getRandomProductName()}`,
        imagens: [{ url: this.getRandomProductImage() }],
        unidadeMedida: { sigla: 'UN', permiteQuantidadeFracionada: false },
        valorReferencia: Math.random() * 500 + 50,
        moeda: 1
      },
      prazoSLA: Math.floor(Math.random() * 15) + 1
    }));

    return of({
      itens: mockProdutos,
      totalPaginas: 3,
      paginaAtual: 1
    }).pipe(delay(500));
  }

  // Métodos para carrinho
  getCarrinhoResumo(): Observable<any> {
    return of({
      quantidadeItensCatalogo: 3,
      quantidadeItensRequisicao: 2,
      quantidadeItensRegularizacao: 1,
      valor: 7500.00
    }).pipe(delay(300));
  }

  getCarrinhoItens(): Observable<any> {
    return this.carrinhoItems.asObservable();
  }

  // Métodos para cotações
  getCotacoes(filtros?: any): Observable<any> {
    const mockCotacoes = Array.from({ length: 10 }, (_, i) => ({
      idCotacao: i + 1,
      descricao: `Cotação ${i + 1} - Materiais de Escritório`,
      dataInicio: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      dataFim: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      situacao: Math.floor(Math.random() * 5) + 1,
      moeda: 1,
      usuarioResponsavel: {
        pessoaFisica: { nome: 'Maria Santos' },
        email: 'maria@empresa.com'
      },
      participantes: Array.from({ length: 5 }, (_, j) => ({
        idPessoaJuridica: j + 1,
        pessoaJuridica: {
          cnpj: this.generateRandomCNPJ(),
          razaoSocial: `Fornecedor ${j + 1} LTDA`
        }
      }))
    }));

    return of({
      itens: mockCotacoes,
      totalPaginas: 2,
      paginaAtual: 1
    }).pipe(delay(500));
  }

  // Métodos para contratos
  getContratos(filtros?: any): Observable<any> {
    const mockContratos = Array.from({ length: 8 }, (_, i) => ({
      idContratoCatalogo: i + 1,
      codigo: `CT-${String(i + 1).padStart(4, '0')}`,
      titulo: `Contrato ${i + 1} - Fornecimento de Materiais`,
      objeto: `Fornecimento de materiais diversos para empresa`,
      dataInicio: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      dataFim: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000),
      situacao: Math.floor(Math.random() * 4) + 1,
      tipoContratoCatalogo: Math.floor(Math.random() * 2) + 1,
      fornecedor: {
        cnpj: this.generateRandomCNPJ(),
        razaoSocial: `Fornecedor Contrato ${i + 1} LTDA`
      },
      gestor: {
        pessoaFisica: { nome: 'Carlos Oliveira' }
      },
      responsavel: {
        pessoaFisica: { nome: 'Ana Costa' }
      }
    }));

    return of({
      itens: mockContratos,
      totalPaginas: 2,
      paginaAtual: 1
    }).pipe(delay(500));
  }

  // Métodos para fornecedores
  getFornecedores(filtros?: any): Observable<any> {
    const mockFornecedores = Array.from({ length: 15 }, (_, i) => ({
      idPessoaJuridica: i + 1,
      cnpj: this.generateRandomCNPJ(),
      razaoSocial: `Fornecedor ${i + 1} LTDA`,
      nomeFantasia: `Fornecedor ${i + 1}`,
      email: `contato${i + 1}@fornecedor.com`,
      telefone: '(11) 3333-4444',
      situacao: Math.floor(Math.random() * 3) + 1,
      enderecos: [
        {
          idEndereco: i + 1,
          logradouro: `Rua ${i + 1}`,
          numero: String(Math.floor(Math.random() * 9999) + 1),
          bairro: 'Centro',
          cep: '01234-567',
          cidade: {
            nome: 'São Paulo',
            estado: { abreviacao: 'SP' }
          },
          tipo: 1
        }
      ]
    }));

    return of(mockFornecedores).pipe(delay(500));
  }

  // Métodos para pedidos
  getPedidos(filtros?: any): Observable<any> {
    const mockPedidos = Array.from({ length: 12 }, (_, i) => ({
      idPedido: i + 1,
      dataConfirmacao: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      situacao: Math.floor(Math.random() * 6) + 1,
      valorTotal: Math.random() * 10000 + 1000,
      fornecedor: {
        razaoSocial: `Fornecedor ${i + 1} LTDA`
      },
      comprador: {
        razaoSocial: 'Empresa Teste LTDA'
      },
      usuario: {
        pessoaFisica: { nome: 'João Silva' }
      },
      itens: [
        {
          idPedidoItem: i + 1,
          produto: {
            descricao: `Produto Pedido ${i + 1}`
          },
          quantidade: Math.floor(Math.random() * 10) + 1,
          valor: Math.random() * 1000 + 100
        }
      ]
    }));

    return of({
      itens: mockPedidos,
      totalPaginas: 3,
      paginaAtual: 1
    }).pipe(delay(500));
  }

  // Métodos para solicitações de compra
  getSolicitacoesCompra(filtros?: any): Observable<any> {
    const mockSolicitacoes = Array.from({ length: 10 }, (_, i) => ({
      idSolicitacaoCompra: i + 1,
      codigo: `SC-${String(i + 1).padStart(6, '0')}`,
      descricao: `Solicitação ${i + 1} - Materiais diversos`,
      dataCriacao: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
      situacao: Math.floor(Math.random() * 4) + 1,
      nomeRequisitante: 'Pedro Santos',
      emailRequisitante: 'pedro@empresa.com',
      itens: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        idItemSolicitacaoCompra: j + 1,
        descricao: `Item ${j + 1} da solicitação`,
        quantidade: Math.floor(Math.random() * 10) + 1,
        valorReferencia: Math.random() * 500 + 50,
        situacao: Math.floor(Math.random() * 3) + 1
      }))
    }));

    return of({
      itens: mockSolicitacoes,
      totalPaginas: 2,
      paginaAtual: 1
    }).pipe(delay(500));
  }

  // Métodos para dashboard
  getDashboardData(): Observable<any> {
    return of({
      indicadoresNumericos: [
        { label: ['Pedidos'], dataSets: [{ data: [45], label: 'Este mês' }] },
        { label: ['Cotações'], dataSets: [{ data: [12], label: 'Em andamento' }] },
        { label: ['Fornecedores'], dataSets: [{ data: [156], label: 'Ativos' }] },
        { label: ['Valor'], dataSets: [{ data: [250000], label: 'Transacionado' }] }
      ],
      indicadoresFornecedorDto: {
        qtdTotalFornecedores: 156,
        qtdTotalFornecedoresHomologados: 120,
        qtdTotalFornecedoresNaoHomologados: 25,
        qtdTotalTotalFornecedoresInteressados: 11
      }
    }).pipe(delay(500));
  }

  // Métodos auxiliares para gerar dados aleatórios
  private getRandomProductName(): string {
    const products = [
      'Notebook', 'Mouse', 'Teclado', 'Monitor', 'Impressora',
      'Papel A4', 'Caneta', 'Grampeador', 'Calculadora', 'Mesa',
      'Cadeira', 'Armário', 'Telefone', 'Cabo USB', 'HD Externo'
    ];
    return products[Math.floor(Math.random() * products.length)];
  }

  private getRandomProductImage(): string {
    const images = [
      'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
      'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg',
      'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
      'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg',
      'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  private getRandomCategory(): string {
    const categories = [
      'Informática', 'Escritório', 'Móveis', 'Eletrônicos',
      'Material de Limpeza', 'Papelaria', 'Telefonia'
    ];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private getRandomBrand(): string {
    const brands = [
      'Dell', 'HP', 'Lenovo', 'Samsung', 'LG', 'Canon', 'Epson'
    ];
    return brands[Math.floor(Math.random() * brands.length)];
  }

  private generateRandomCNPJ(): string {
    const num = Math.floor(Math.random() * 99999999) + 10000000;
    return `${String(num).substring(0, 2)}.${String(num).substring(2, 5)}.${String(num).substring(5, 8)}/0001-${String(Math.floor(Math.random() * 99) + 10)}`;
  }

  // Métodos para listas auxiliares
  getEstados(): Observable<any[]> {
    return of([
      { idEstado: 1, nome: 'São Paulo', abreviacao: 'SP' },
      { idEstado: 2, nome: 'Rio de Janeiro', abreviacao: 'RJ' },
      { idEstado: 3, nome: 'Minas Gerais', abreviacao: 'MG' },
      { idEstado: 4, nome: 'Paraná', abreviacao: 'PR' },
      { idEstado: 5, nome: 'Rio Grande do Sul', abreviacao: 'RS' }
    ]).pipe(delay(300));
  }

  getCategorias(): Observable<any[]> {
    return of([
      { idCategoriaProduto: 1, nome: 'Informática' },
      { idCategoriaProduto: 2, nome: 'Escritório' },
      { idCategoriaProduto: 3, nome: 'Móveis' },
      { idCategoriaProduto: 4, nome: 'Eletrônicos' },
      { idCategoriaProduto: 5, nome: 'Material de Limpeza' }
    ]).pipe(delay(300));
  }

  getMarcas(): Observable<any[]> {
    return of([
      { idMarca: 1, nome: 'Dell' },
      { idMarca: 2, nome: 'HP' },
      { idMarca: 3, nome: 'Lenovo' },
      { idMarca: 4, nome: 'Samsung' },
      { idMarca: 5, nome: 'LG' }
    ]).pipe(delay(300));
  }

  getEnderecos(): Observable<any[]> {
    return of([
      {
        idEndereco: 1,
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cep: '01234-567',
        cidade: {
          nome: 'São Paulo',
          estado: { abreviacao: 'SP' }
        },
        tipo: 1
      },
      {
        idEndereco: 2,
        logradouro: 'Av. Paulista',
        numero: '1000',
        bairro: 'Bela Vista',
        cep: '01310-100',
        cidade: {
          nome: 'São Paulo',
          estado: { abreviacao: 'SP' }
        },
        tipo: 2
      }
    ]).pipe(delay(300));
  }

  getCentrosCusto(): Observable<any[]> {
    return of([
      { idCentroCusto: 1, descricao: 'Administração' },
      { idCentroCusto: 2, descricao: 'Vendas' },
      { idCentroCusto: 3, descricao: 'Produção' },
      { idCentroCusto: 4, descricao: 'TI' }
    ]).pipe(delay(300));
  }

  getCondicoesPagamento(): Observable<any[]> {
    return of([
      { idCondicaoPagamento: 1, descricao: 'À vista' },
      { idCondicaoPagamento: 2, descricao: '30 dias' },
      { idCondicaoPagamento: 3, descricao: '60 dias' },
      { idCondicaoPagamento: 4, descricao: '90 dias' }
    ]).pipe(delay(300));
  }

  // Métodos para notificações
  getNotificacoes(): Observable<any> {
    return this.notificacoes.asObservable();
  }

  // Métodos para salvar dados (simulados)
  salvarPedido(pedido: any): Observable<any> {
    return of({ success: true, idPedido: Math.floor(Math.random() * 10000) + 1 }).pipe(delay(1000));
  }

  salvarCotacao(cotacao: any): Observable<any> {
    return of({ success: true, idCotacao: Math.floor(Math.random() * 10000) + 1 }).pipe(delay(1000));
  }

  salvarContrato(contrato: any): Observable<any> {
    return of({ success: true, idContrato: Math.floor(Math.random() * 10000) + 1 }).pipe(delay(1000));
  }

  adicionarAoCarrinho(item: any): Observable<any> {
    const currentItems = this.carrinhoItems.value;
    currentItems.push(item);
    this.carrinhoItems.next(currentItems);
    return of({ success: true }).pipe(delay(500));
  }

  // Métodos para configurações
  getConfiguracoes(): Observable<any> {
    return of({
      empresas: [
        {
          idPessoaJuridica: 1,
          cnpj: '12.345.678/0001-90',
          razaoSocial: 'Empresa Teste LTDA',
          nomeFantasia: 'Empresa Teste'
        }
      ],
      tiposRequisicao: [
        { idTipoRequisicao: 1, nome: 'Material de Escritório', sigla: 'ME' },
        { idTipoRequisicao: 2, nome: 'Equipamentos', sigla: 'EQ' },
        { idTipoRequisicao: 3, nome: 'Serviços', sigla: 'SV' }
      ],
      tiposPedido: [
        { idTipoPedido: 1, nomeTipoPedido: 'Pedido Normal', siglaTipoPedido: 'PN' },
        { idTipoPedido: 2, nomeTipoPedido: 'Pedido Urgente', siglaTipoPedido: 'PU' }
      ]
    }).pipe(delay(500));
  }
}