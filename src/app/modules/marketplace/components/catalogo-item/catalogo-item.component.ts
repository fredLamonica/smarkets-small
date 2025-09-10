import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'catalogo-item',
  templateUrl: './catalogo-item.component.html',
  styleUrls: ['./catalogo-item.component.scss']
})
export class CatalogoItemComponent implements OnInit {
  @Input() item: any;
  @Input() podeAdicionarCarrinho = true;
  @Output() addCarrinho = new EventEmitter();
  @Output() triggerFocusEmpresaCompradora = new EventEmitter();

  quantidade = 1;
  maxQuant = 999999;

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

  constructor() {}

  ngOnInit() {
    if (this.item?.contratoCatalogoItem?.loteMinimo) {
      this.quantidade = this.item.contratoCatalogoItem.loteMinimo;
    }
  }

  exibirDetalhesCatalogo(id: number) {
    // Simular abertura de modal de detalhes
    alert(`Exibindo detalhes do produto catálogo ID: ${id}`);
  }

  exibirDetalhesRequisicao(id: number) {
    // Simular abertura de modal de detalhes
    alert(`Exibindo detalhes do produto requisição ID: ${id}`);
  }

  solicitarAdicaoNoCarrinho() {
    if (!this.podeAdicionarCarrinho) {
      this.triggerFocusEmpresaCompradora.emit();
      return;
    }

    const itemCarrinho = {
      ...this.item,
      quantidade: this.quantidade
    };

    this.addCarrinho.emit(itemCarrinho);
  }

  solicitarAdicionarCarrinhoRequisicao() {
    this.solicitarAdicaoNoCarrinho();
  }

  adicionarFavorito() {
    // Simular adição aos favoritos
    this.item.idProdutoFavorito = this.item.idProdutoFavorito ? null : Math.floor(Math.random() * 1000) + 1;
    alert(this.item.idProdutoFavorito ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!');
  }

  prazoEntrega(item: any): string {
    if (item?.contratoCatalogoItem?.prazoEntrega) {
      const prazo = item.contratoCatalogoItem.prazoEntrega;
      return prazo === 1 ? '1 dia útil' : `${prazo} dias úteis`;
    }
    return 'Consultar';
  }
}