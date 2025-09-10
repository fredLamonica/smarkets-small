import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterProdutoModalComponent } from '@shared/components';
import { CatalogoItem, PedidoItem, SituacaoPedidoItem, TipoCatalogoItem, TipoProduto, Usuario } from '@shared/models';
import { ItemSolicitacaoCompra } from '@shared/models/solicitacao-compra/item-solicitacao-compra';
import { AutenticacaoService, CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { VincularProdutoExistenteComponent } from '../../vincular-produto-existente/vincular-produto-existente.component';
import { ConfirmarVinculoRequisicaoItemComponent } from '../confirmar-vinculo-requisicao-item/confirmar-vinculo-requisicao-item.component';

@Component({
  selector: 'vincular-produto-item',
  templateUrl: './vincular-produto-item.component.html',
  styleUrls: ['./vincular-produto-item.component.scss'],
})
export class VincularProdutoItemComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input('item') item: ItemSolicitacaoCompra;
  @Input() descricao: string;
  @Input('tipo-documento') tipoDocumento: string;
  @Output('vincular-requisicao') vincularRequisicaoEmitter = new EventEmitter();
  @Output('vincular-pedido') vincularPedidoEmitter = new EventEmitter();

  exibirFlagSapEm: boolean = false;
  exibirFlagSapEmNaoAvaliada: boolean = false;
  exibirFlagSapEntrFaturas: boolean = false;
  exibirFlagSapRevFatEm: boolean = false;

  usuarioAtual: Usuario;

  itensCatalogoChunks: Array<Array<CatalogoItem>> = new Array<Array<CatalogoItem>>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private catalogoService: CatalogoService,
    private modalService: NgbModal,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.obterCatalogo();
    this.usuarioAtual = this.authService.usuario();
    this.obterParametrosIntegracaoSapHabilitado();
  }

  obterCatalogo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService.filtrarProdutoVinculo(this.descricao).subscribe(
      (response) => {
        if (response) { this.divideCatalogoInChunks(response); }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  confirmarVinculo(event) {
    if (event.item.tipo == TipoCatalogoItem.Catalogo) { this.confirmarVinculoPedido(event); } else { this.confirmarVinculoRequisicao(event); }
  }

  vincularProduto() {
    const modalRef = this.modalService.open(VincularProdutoExistenteComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result) {
        this.confirmarVinculo(result);
      }
    });
  }

  cadastrarProduto() {
    const modalRef = this.modalService.open(ManterProdutoModalComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.descricao = this.item.nomeProduto
      ? this.item.nomeProduto
      : this.item.descricao;
    modalRef.componentInstance.descricaoDetalhada = this.item.descricaoProduto;
    modalRef.componentInstance.codigo = this.item.codigoProduto;
    modalRef.componentInstance.ncm = this.item.ncm;
    modalRef.componentInstance.valorReferencia = this.item.valorReferencia;
    modalRef.componentInstance.tipoProduto = TipoProduto.Produto;

    modalRef.componentInstance.codigoCategoriaProduto = this.item.codigoCategoria;
    modalRef.componentInstance.nomeCategoriaProduto = this.item.nomeCategoria;

    modalRef.componentInstance.siglaUnidadeMedida = this.item.siglaUnidadeMedida;
    modalRef.componentInstance.codigoUnidadeMedida = this.item.siglaUnidadeMedida;
    modalRef.componentInstance.descricaoUnidadeMedida = this.item.descricaoUnidadeMedida;
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

  private obterParametrosIntegracaoSapHabilitado() {
    if (this.usuarioAtual.permissaoAtual.pessoaJuridica.integracaoSapHabilitada) {
      this.exibirFlagSapEm = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEm;
      this.exibirFlagSapEmNaoAvaliada = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEmNaoAvaliada;
      this.exibirFlagSapEntrFaturas = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapEntrFaturas;
      this.exibirFlagSapRevFatEm = this.usuarioAtual.permissaoAtual.pessoaJuridica.exibirFlagSapRevFatEm;
    }
  }

  private divideCatalogoInChunks(itens: Array<CatalogoItem>) {
    for (let i = 0, j = itens.length; i < j; i += 4) {
      this.itensCatalogoChunks.push(itens.slice(i, i + 4));
    }
  }

  private confirmarVinculoPedido(event) {
    const pedidoItem = this.criarPedidoItem(event);
    this.vincularPedidoEmitter.emit(pedidoItem);
  }

  private confirmarVinculoRequisicao(event) {
    const modalRef = this.modalService.open(ConfirmarVinculoRequisicaoItemComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.item = event.item;
    modalRef.componentInstance.quantidade = event.quantidade;
    modalRef.componentInstance.tipoDocumento = this.tipoDocumento;
    modalRef.componentInstance.itemSolicitacaoCompra = this.item;
    modalRef.result.then((result) => {
      if (result) {
        this.vincularRequisicaoEmitter.emit(result);
      } else {
        this.obterCatalogo();
      }
    });
  }

  private criarPedidoItem(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const pedidoItem = new PedidoItem(
      0,
      '',
      0,
      0,
      0,
      event.item.contratoCatalogoItem.idContratoCatalogoItem,
      event.item.contratoCatalogoItem,
      event.quantidade,
      null,
      null,
      SituacaoPedidoItem.Ativo,
      null,
      event.item.contratoCatalogoItem.valor,
      event.item.contratoCatalogoItem.valor,
      event.item.contratoCatalogoItem.valor * event.quantidade,
      event.item.contratoCatalogoItem.moeda,
      event.item.contratoCatalogoItem.idMarca,
      null,
      event.item.contratoCatalogoItem.idProduto,
      null,
      event.item.contratoCatalogoItem.idFornecedor,
      event.item.contratoCatalogoItem.garantia,
      event.item.contratoCatalogoItem.frete,
      null,
      this.item.idItemSolicitacaoCompra,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );
    pedidoItem.idUsuarioSolicitante = this.usuarioAtual.idUsuario;

    // Inicializando Propriedades SAP
    if (this.exibirFlagSapEm) { pedidoItem.sapEm = false; }

    if (this.exibirFlagSapEmNaoAvaliada) { pedidoItem.sapEmNaoAvaliada = false; }

    if (this.exibirFlagSapEntrFaturas) { pedidoItem.sapEntrFaturas = false; }

    if (this.exibirFlagSapRevFatEm) { pedidoItem.sapRevFatEm = false; }

    return pedidoItem;
  }
}
