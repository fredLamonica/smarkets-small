import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterProdutoModalComponent } from '@shared/components';
import { CatalogoItem, ItemSolicitacaoCompra, SubItemSolicitacaoCompra, TipoCatalogoItem, TipoProduto } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ManterSolicitacaoProdutoComponent } from 'src/app/modules/solicitacao-produto/manter-solicitacao-produto/manter-solicitacao-produto.component';
import { VinculoProdutoFiltro } from '../../../../shared/models/fltros/vinculo-produto-filtro';
import { VincularProdutoExistenteComponent } from '../../vincular-produto-existente/vincular-produto-existente.component';
import { ConfirmarVinculoPedidoSubItemComponent } from '../confirmar-vinculo-pedido-sub-item/confirmar-vinculo-pedido-sub-item.component';
import { ConfirmarVinculoRequisicaoSubItemComponent } from '../confirmar-vinculo-requisicao-sub-item/confirmar-vinculo-requisicao-sub-item.component';

@Component({
  selector: 'vincular-produto-sub-item',
  templateUrl: './vincular-produto-sub-item.component.html',
  styleUrls: ['./vincular-produto-sub-item.component.scss'],
})
export class VincularProdutoSubItemComponent implements OnInit, OnChanges {
  @BlockUI() blockUI: NgBlockUI;

  @Input() descricao: string;

  @Input('sub-item') subItem: SubItemSolicitacaoCompra;
  @Input('item-solicitacao') itemSolicitacaoCompra: ItemSolicitacaoCompra;
  @Input('id-itemSolicitacao') idItemSolicitacaoCompra: number;

  @Input('id-pedido') idPedido: number;
  @Input('id-fornecedor') idFornecedor: number;
  @Input('id-requisicao') idRequisicao: number;

  @Input('tipo-vinculo-sub-item') tipoVinculoSubItens?: TipoCatalogoItem;

  @Input('tipo-documento') tipoDocumento: string;

  @Output('vincular-requisicao') vincularRequisicaoEmitter = new EventEmitter();
  @Output('vincular-pedido') vincularPedidoEmitter = new EventEmitter();

  vinculoProdutoFiltro: VinculoProdutoFiltro = new VinculoProdutoFiltro();

  itensCatalogoChunks: Array<Array<CatalogoItem>> = new Array<Array<CatalogoItem>>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.obterCatalogo();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tipoVinculoSubItens.currentValue !== changes.tipoVinculoSubItens.previousValue) {
      this.itensCatalogoChunks = new Array<Array<CatalogoItem>>();
      this.obterCatalogo();
    }
  }

  obterCatalogo() {

    this.vinculoProdutoFiltro.idFornecedor = this.idFornecedor;
    this.vinculoProdutoFiltro.descricao = this.descricao;
    this.vinculoProdutoFiltro.idProduto = null;
    this.vinculoProdutoFiltro.tipoCatalogoItem = this.tipoVinculoSubItens;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService.filtrarCatalogosVinculoProduto(this.vinculoProdutoFiltro).subscribe(
      (response) => {
        if (response) {
          this.divideCatalogoInChunks(response);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  confirmarVinculo(event) {
    if (event.item.tipo === TipoCatalogoItem.Catalogo) {
      this.confirmarVinculoPedido(event);
    } else {
      this.confirmarVinculoRequisicao(event);
    }
  }

  solicitarCadastro() {
    const modalRef = this.modalService.open(ManterSolicitacaoProdutoComponent, { centered: true, size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.result.then((result) => { });
  }

  vincularProduto() {
    const modalRef = this.modalService.open(VincularProdutoExistenteComponent, { centered: true });
    modalRef.componentInstance.tipoVinculoSubItens = this.tipoVinculoSubItens;
    modalRef.componentInstance.idFornecedor = this.idFornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.confirmarVinculo(result);
      }
    });
  }

  cadastrarProduto() {
    const modalRef = this.modalService.open(ManterProdutoModalComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.descricao = this.subItem.nomeServico;
    modalRef.componentInstance.descricaoDetalhada = this.itemSolicitacaoCompra.descricaoProduto;
    modalRef.componentInstance.codigo = this.itemSolicitacaoCompra.codigoProduto;
    modalRef.componentInstance.ncm = this.itemSolicitacaoCompra.ncm;
    modalRef.componentInstance.valorReferencia = this.subItem.valorReferencia;
    modalRef.componentInstance.tipoProduto = TipoProduto.Servico;

    modalRef.componentInstance.codigoCategoriaProduto = this.subItem.codigoCategoria ? this.subItem.codigoCategoria : this.itemSolicitacaoCompra.codigoCategoria;
    modalRef.componentInstance.nomeCategoriaProduto = this.subItem.codigoCategoria ? 'Serviço' : this.itemSolicitacaoCompra.nomeCategoria;

    modalRef.componentInstance.siglaUnidadeMedida = this.itemSolicitacaoCompra.siglaUnidadeMedida;
    modalRef.componentInstance.codigoUnidadeMedida = this.itemSolicitacaoCompra.siglaUnidadeMedida;
    modalRef.componentInstance.descricaoUnidadeMedida = this.itemSolicitacaoCompra.descricaoUnidadeMedida;
    modalRef.componentInstance.permiteQuantidadeFracionadaUnidadeMedida = true;

    modalRef.result.then((result) => {
      if (result) {
        const catalogoItem = new CatalogoItem();
        catalogoItem.produto = result;
        catalogoItem.tipo = TipoCatalogoItem.Requisicao;
        this.confirmarVinculo({ item: catalogoItem });
      }
    });
  }

  private divideCatalogoInChunks(itens: Array<CatalogoItem>) {
    if (this.idRequisicao) {
      itens = itens.filter((item) => item.tipo === TipoCatalogoItem.Requisicao);
    }
    for (let i = 0, j = itens.length; i < j; i += 4) {
      this.itensCatalogoChunks.push(itens.slice(i, i + 4));
    }
  }

  private confirmarVinculoPedido(event) {
    const modalRef = this.modalService.open(ConfirmarVinculoPedidoSubItemComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.item = event.item;
    modalRef.componentInstance.idPedido = this.idPedido;
    modalRef.componentInstance.subItem = this.subItem;
    modalRef.componentInstance.quantidade = event.quantidade;
    modalRef.componentInstance.idItemSolicitacaoCompra = this.idItemSolicitacaoCompra;
    modalRef.componentInstance.itemSolicitacaoCompra = this.itemSolicitacaoCompra;
    modalRef.result.then((result) => {
      if (result) {
        this.vincularPedidoEmitter.emit(result);
      }
    });
  }

  private confirmarVinculoRequisicao(event) {
    const modalRef = this.modalService.open(ConfirmarVinculoRequisicaoSubItemComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.item = event.item;
    modalRef.componentInstance.quantidade = event.quantidade;
    modalRef.componentInstance.tipoDocumento = this.tipoDocumento;
    modalRef.componentInstance.idRequisicao = this.idRequisicao;
    modalRef.componentInstance.subItem = this.subItem;
    modalRef.componentInstance.itemSolicitacaoCompra = this.itemSolicitacaoCompra;
    modalRef.componentInstance.idItemSolicitacaoCompra = this.idItemSolicitacaoCompra;
    modalRef.result.then((result) => {
      if (result) {
        this.vincularRequisicaoEmitter.emit(result);
      }
    });
  }

}
