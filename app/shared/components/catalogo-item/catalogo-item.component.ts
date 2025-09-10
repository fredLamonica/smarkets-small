import { getCurrencySymbol } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoItem, Fornecedor, PerfilUsuario, Produto, TipoCatalogoItem, TipoFrete, Usuario } from '@shared/models';
import { AutenticacaoService, FornecedorService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { DetalhesProdutoComponent } from 'src/app/modules/catalogo/detalhes-produto/detalhes-produto.component';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ProdutoFavoritoInsercaoDto } from '../../models/dto/produto-favorito-insercao-dto';
import { TipoCatalogo } from '../../models/enums/tipo-catalogo';
import { ProdutoFavoritoService } from '../../providers/produto-favorito.service';
import { ErrorService } from '../../utils/error.service';
import { Unsubscriber } from '../base/unsubscriber';
import { ConfirmacaoComponent } from '../modals/confirmacao/confirmacao.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'catalogo-item',
  templateUrl: './catalogo-item.component.html',
  styleUrls: ['./catalogo-item.component.scss'],
})
export class CatalogoItemComponent extends Unsubscriber implements OnInit, OnChanges, AfterViewInit {

  get quantidade(): number {
    return this._quantidade;
  }
  set quantidade(quantidade: number) {
    this._quantidade = quantidade;
  }

  @BlockUI() blockUI: NgBlockUI;

  @Input() podeAdicionarCarrinho: boolean;
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
    switch (this.item.tipo) {
      case TipoCatalogoItem.Catalogo:
        this.produtoFavoritoInsercaoDto = new ProdutoFavoritoInsercaoDto({ idContratoCatalogoItem: this.item.contratoCatalogoItem.idContratoCatalogoItem });
        break;

      case TipoCatalogoItem.Requisicao:
        this.produtoFavoritoInsercaoDto = new ProdutoFavoritoInsercaoDto({ idProduto: this.item.produto.idProduto });
        break;
    }
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

  solicitarAdicaoNoCarrinho() {
    if (this.podeAdicionarProdutoAoCarrinho()) {
      this.verificarAceiteDeTermosDeBoasPraticas();
    }
  }

  solicitarAdicionarCarrinhoRequisicao() {
    if (this.podeAdicionarProdutoAoCarrinho()) {
      this.adicionarCarrinho();
    }
  }

  verificarAceiteDeTermosDeBoasPraticas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (this.usuario.permissaoAtual.pessoaJuridica.habilitarModuloFornecedores) {
      const idPessoaJuridicaFornecedor = this.item.contratoCatalogoItem.fornecedor.idPessoaJuridica;

      this.fornecedorService.ObterFornecedorRedeLocalPorIdPessoaJuridica(idPessoaJuridicaFornecedor).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (!response) {
              this.abrirModal(null);
            } else if (response && response.aceitarTermo) {
              this.abrirModal(this.item.contratoCatalogoItem.fornecedor as Fornecedor);
            } else {
              this.adicionarCarrinho();
            }

            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      this.adicionarCarrinho();
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

    modalRef.result.then(
      (result) => {
        if (result) {
          this.solicitarAdicaoNoCarrinho();
        }
      },
      (reason) => { });
  }

  exibirDetalhesRequisicao(idProduto: number) {
    const modalRef = this.modalService.open(DetalhesProdutoComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.idProduto = idProduto;

    modalRef.result.then(
      (result) => {
        if (result) {
          this.adicionarCarrinho();
        }
      },
      (reason) => { });
  }

  prazoEntrega(catalogoItem: CatalogoItem): string {
    if (catalogoItem.contratoCatalogoItem.estadosItem && catalogoItem.contratoCatalogoItem.estadosItem.length > 1) {
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

  private podeAdicionarProdutoAoCarrinho(): boolean {
    if (!this.podeAdicionarCarrinho) {
      this.toastr.warning('Selecione uma empresa antes de adicionar ao carrinho.');
      this.triggerFocusEmpresaCompradora.emit();

      return false;
    }

    return true;
  }

  private adicionarCarrinho() {
    if (this.usuario.permissaoAtual.perfil !== PerfilUsuario.Cadastrador) {
      if (this.pedidoValido()) {
        this.addCarrinhoEmitter.emit({ item: this.item, quantidade: this.quantidade });
      }
    } else {
      this.toastr.warning('Você não tem permissão para realizar esta ação.');
    }
  }

  private abrirModal(fornecedor: Fornecedor) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.cancelarLabel = 'none';
    modalRef.componentInstance.confirmarLabel = 'Voltar';
    modalRef.componentInstance.html = true;

    if (fornecedor) {
      modalRef.componentInstance.confirmacao = `
      <p>Não foi possível prosseguir com esta ação pois o fornecedor <b>${fornecedor.razaoSocial}</b>, encontra-se bloqueado/inativo. Por favor contate o Gestor de Fornecedores.</p>
      `;
    } else {
      modalRef.componentInstance.confirmacao = `
      <p>Não foi possível prosseguir com esta ação pois o fornecedor não está cadastrado na plataforma. Por favor contate o Gestor de Fornecedores.</p>
      `;
    }
  }

  private pedidoValido(): boolean {
    if (this.item.tipo === TipoCatalogoItem.Catalogo && this.quantidade < this.item.contratoCatalogoItem.loteMinimo) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.COULD_NOT_ADD_CART_MINIMUM_BATCH,
      );

      return false;
    }

    if (this.item.tipo === TipoCatalogoItem.Requisicao && this.quantidade < 1) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.COULD_NOT_ADD_CART_MINIMUM_BATCH,
      );

      return false;
    }

    if (this.quantidade > this.maxQuant) {
      this.toastr.warning(
        this.translationLibrary.translations.ALERTS.INVALID_ORDER_ITEM_EXCEEDS_MAX_QUANTITY,
      );

      return false;
    }

    return true;
  }
}
