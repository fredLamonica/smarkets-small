import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MockDataService } from '../../../../shared/services/mock/mock-data.service';

@Component({
  selector: 'smk-aba-catalogo',
  templateUrl: './aba-catalogo.component.html',
  styleUrls: ['./aba-catalogo.component.scss']
})
export class AbaCatalogoComponent implements OnInit {
  @Input() empresa: number;
  @Input() filtroSuperior: any;
  @Input() ativa: boolean;
  @Output() triggerFocusEmpresaCompradora = new EventEmitter();

  form: FormGroup;
  registros: any[] = [];
  empresas: any[] = [];
  opcoesTipoCatalogo: any[] = [];
  produtosLoading = false;
  empresasLoading = false;
  isFirstLoad = true;
  pagina = 1;
  totalPaginas = 1;
  registrosPorPagina = 15;
  podeAdicionarCarrinho = true;

  filtro = {
    ordenacao: { descricao: 'Relevância' }
  };

  opcoesOrdenacao = [
    { descricao: 'Relevância' },
    { descricao: 'Menor Preço' },
    { descricao: 'Maior Preço' },
    { descricao: 'Nome A-Z' },
    { descricao: 'Nome Z-A' }
  ];

  TipoCatalogoItem = {
    Catalogo: 1,
    Requisicao: 2
  };

  TipoCatalogo = {
    1: 'Catálogo Smarkets',
    2: 'Catálogo Fornecedor'
  };

  TipoFrete = {
    1: 'CIF',
    2: 'FOB',
    3: 'FOB Dirigido',
    4: 'FOB Redespacho'
  };

  constructor(
    private fb: FormBuilder,
    private mockDataService: MockDataService
  ) {}

  ngOnInit() {
    this.initializeForm();
    this.loadEmpresas();
    this.loadTiposCatalogo();
    if (this.ativa) {
      this.loadProdutos();
    }
  }

  private initializeForm() {
    this.form = this.fb.group({
      empresaCatalogo: [null],
      tipoCatalogo: [null]
    });
  }

  private loadEmpresas() {
    this.empresasLoading = true;
    this.mockDataService.getConfiguracoes().subscribe(
      config => {
        this.empresas = config.empresas;
        this.empresasLoading = false;
      }
    );
  }

  private loadTiposCatalogo() {
    this.opcoesTipoCatalogo = [
      { index: 1, name: 'Catálogo Smarkets' },
      { index: 2, name: 'Catálogo Fornecedor' }
    ];
  }

  private loadProdutos() {
    this.produtosLoading = true;
    this.isFirstLoad = false;

    this.mockDataService.getProdutosCatalogo().subscribe(
      response => {
        this.registros = response.itens;
        this.totalPaginas = response.totalPaginas;
        this.produtosLoading = false;
      },
      error => {
        this.produtosLoading = false;
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  filtroChange(filtro: any) {
    this.filtro = { ...this.filtro, ...filtro };
    this.loadProdutos();
  }

  ordenar(ordenacao: any) {
    this.filtro.ordenacao = ordenacao;
    this.loadProdutos();
  }

  paginar(evento: any) {
    this.pagina = evento.page;
    this.registrosPorPagina = evento.recordsPerPage;
    this.loadProdutos();
  }

  adicionarAoCarrinho(item: any) {
    this.mockDataService.adicionarAoCarrinho(item).subscribe(
      response => {
        if (response.success) {
          alert('Item adicionado ao carrinho com sucesso!');
        }
      }
    );
  }

  executeTriggerFocusEmpresaCompradora() {
    this.triggerFocusEmpresaCompradora.emit();
  }

  solicitarCadastro() {
    alert('Redirecionando para solicitação de cadastro de produto (simulado)');
  }
}