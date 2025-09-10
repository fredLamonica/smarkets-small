import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { CatalogoItem, TipoCatalogoItem, Moeda, Usuario, PerfilUsuario, Produto } from '@shared/models';
import { TranslationLibraryService, AutenticacaoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'catalogo-item-grade',
  templateUrl: './catalogo-item-grade.component.html',
  styleUrls: ['./catalogo-item-grade.component.scss']
})
export class CatalogoItemGradeComponent implements OnInit, OnChanges {

  public maxQuant = 999999999;

  @Input() item: CatalogoItem;
  @Input("valor-referencia") valorReferencia: number = -1;
  @Input() quant: number = -1;

  @Output('add-carrinho') addCarrinhoEmitter = new EventEmitter();

  private usuario: Usuario;

  public Moeda = Moeda;
  public TipoCatalogoItem = TipoCatalogoItem;

  public _quantidade: number;

  get quantidade(): number {
    return this._quantidade;
  }
  set quantidade(quantidade: number) {
    this._quantidade = quantidade;
  }

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService
  ) { }

  ngOnInit() {
    this.obterDadosAutenticacao();    
  }

  ngOnChanges() {
    if (this.item.tipo == TipoCatalogoItem.Catalogo) {
      this.quantidade = this.item.contratoCatalogoItem.loteMinimo;
      
      if(this.quant > this.quantidade)
        this.quantidade = this.quant;

      this.definirMax(this.item.contratoCatalogoItem.produto);
    }    
    else {
      if (this.quant != -1 )
        this.quantidade = this.quant;
      else
        this.quantidade = 1;

      if (this.valorReferencia != -1)
        this.item.produto.valorReferencia = this.valorReferencia;
      
      this.definirMax(this.item.produto);
    }
  }

  public obterDadosAutenticacao() {
    this.usuario = this.authService.usuario();
  }

  public definirMax(produto: Produto) {
    if (produto && produto.unidadeMedida && produto.unidadeMedida.permiteQuantidadeFracionada) {
      this.maxQuant = 999999999.9999
    }
    else {
      this.maxQuant = 999999999;
    }
  }

  public adicionarCarrinho() {
    if (this.usuario.permissaoAtual.perfil != PerfilUsuario.Cadastrador) {
      if (this.pedidoValido()) {
        this.addCarrinhoEmitter.emit({ item: this.item, quantidade: this.quantidade });
      }
    }
    else {
      this.toastr.warning("Você não tem acesso a realizar esta ação.");
    }
  }

  private pedidoValido(): boolean {

    if (this.item.tipo == TipoCatalogoItem.Catalogo && this.quantidade < this.item.contratoCatalogoItem.loteMinimo) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.COULD_NOT_ADD_CART_MINIMUM_BATCH);
      return false;
    }

    if (this.item.tipo == TipoCatalogoItem.Requisicao && this.quantidade < 1) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.COULD_NOT_ADD_CART_MINIMUM_BATCH);
      return false;
    }

    if (this.quantidade > this.maxQuant) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.INVALID_ORDER_ITEM_EXCEEDS_MAX_QUANTITY);
      return false;
    }

    return true;
  }

}
