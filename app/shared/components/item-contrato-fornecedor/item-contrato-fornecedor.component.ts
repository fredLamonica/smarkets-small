import { getCurrencySymbol } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { DetalhesProdutoComponent } from '../../../modules/catalogo/detalhes-produto/detalhes-produto.component';
import { CatalogoItem, PerfilUsuario, Produto, TipoCatalogoItem, TipoFrete, Usuario } from '../../models';
import { ProdutoFavoritoInsercaoDto } from '../../models/dto/produto-favorito-insercao-dto';
import { TipoCatalogo } from '../../models/enums/tipo-catalogo';
import { AutenticacaoService, FornecedorService, TranslationLibraryService } from '../../providers';
import { ProdutoFavoritoService } from '../../providers/produto-favorito.service';
import { ErrorService } from '../../utils/error.service';
import { Unsubscriber } from '../base/unsubscriber';

@Component({
  selector: 'smk-item-contrato-fornecedor',
  templateUrl: './item-contrato-fornecedor.component.html',
  styleUrls: ['./item-contrato-fornecedor.component.scss']
})
export class ItemContratoFornecedorComponent extends Unsubscriber implements OnInit, OnChanges, AfterViewInit {

  get quantidade(): number {
    return this._quantidade;
  }
  set quantidade(quantidade: number) {
    this._quantidade = quantidade;
  }

  @BlockUI() blockUI: NgBlockUI;

  @Input() item: CatalogoItem;

  // tslint:disable-next-line: no-output-rename
  @Output('add-carrinho') addCarrinhoEmitter = new EventEmitter();
  @Output() triggerFocusEmpresaCompradora: EventEmitter<void> = new EventEmitter<void>();

  maxQuant = 999999999;
  TipoFrete = TipoFrete;
  TipoCatalogoItem = TipoCatalogoItem;
  usuario: Usuario;
  PerfilUsuario = PerfilUsuario;
  _quantidade: number;

  maskPositiveInteger = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: null,
    allowDecimal: false,
    decimalSymbol: ',',
    decimalLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 10,
  });

  TipoCatalogo = TipoCatalogo;

  private produtoFavoritoInsercaoDto: ProdutoFavoritoInsercaoDto;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private fornecedorService: FornecedorService,
    private produtoFavoritoService: ProdutoFavoritoService,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.obterDadosAutenticacao();
  }

  ngOnChanges() {
    if (this.item.tipo === TipoCatalogoItem.Catalogo) {
      this.quantidade = this.item.contratoCatalogoItem.loteMinimo;
      this.definirMax(this.item.contratoCatalogoItem.produto);
    } else {
      this.quantidade = 1;
      this.definirMax(this.item.produto);
    }
  }

  ngAfterViewInit(): void {
    this.produtoFavoritoInsercaoDto = new ProdutoFavoritoInsercaoDto({ idContratoCatalogoItem: this.item.contratoCatalogoItem.idContratoCatalogoItem });
  }

  definirMax(produto: Produto) {
    if (produto && produto.unidadeMedida && produto.unidadeMedida.permiteQuantidadeFracionada) {
      this.maxQuant = 999999999.9999;
    } else {
      this.maxQuant = 999999999;
    }
  }

  adicionar() {
    if (this.quantidade < this.maxQuant) {
      this.quantidade++;
    }
  }

  obterDadosAutenticacao() {
    this.usuario = this.authService.usuario();
  }

  subtrair() {
    if (
      this.item.tipo === TipoCatalogoItem.Catalogo &&
      this.quantidade > this.item.contratoCatalogoItem.loteMinimo
    ) {
      this.quantidade--;
    } else if (this.quantidade > 0) {
      this.quantidade--;
    }
  }

  getCurrencySymbol(code: string, format: 'narrow' | 'wide', locale: string) {
    return getCurrencySymbol(code, format, locale);
  }

  exibirDetalhesCatalogo(idContratoCatalogoItem: number) {
    const modalRef = this.modalService.open(DetalhesProdutoComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.idContratoCatalogoItem = idContratoCatalogoItem;
    modalRef.componentInstance.fornecedor = true;

    modalRef.result.then(
      (result) => {
        if (result) {
        }
      },
      (reason) => { });
  }

  prazoEntrega(catalogoItem: CatalogoItem): string {
    if (catalogoItem.contratoCatalogoItem.estadosItem.length > 1) {
      return catalogoItem.menorPrazoEmDias > 1
        ? `${catalogoItem.menorPrazoEmDias} dias úteis`
        : `${catalogoItem.menorPrazoEmDias} dia útil`;
    }

    return catalogoItem.menorPrazoEmDias > 1
      ? catalogoItem.menorPrazoEmDias + ' dias úteis'
      : catalogoItem.menorPrazoEmDias + ' dia útil';
  }

  adicionarFavorito() {
    this.blockUI.start();

    if (this.item.idProdutoFavorito) {
      this.produtoFavoritoService.excluir(this.item.idProdutoFavorito).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          (linhasAfetadas) => {
            if (linhasAfetadas && linhasAfetadas > 0) {
              this.item.idProdutoFavorito = undefined;
            }
          },
          (error) => this.errorService.treatError(error),
        );
    } else {
      this.produtoFavoritoService.inserir(this.produtoFavoritoInsercaoDto).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          (idProdutoFavoritoInserido) => {
            if (idProdutoFavoritoInserido && idProdutoFavoritoInserido > 0) {
              this.item.idProdutoFavorito = idProdutoFavoritoInserido;
            }
          },
          (error) => this.errorService.treatError(error),
        );
    }
  }

}
