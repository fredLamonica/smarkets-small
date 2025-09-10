import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoItem, CustomTableColumn, CustomTableColumnType, CustomTableSettings, PedidoItem, SituacaoPedidoItem } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'app-selecionar-outro-produto',
  templateUrl: './selecionar-outro-produto.component.html',
  styleUrls: ['./selecionar-outro-produto.component.scss'],
})
export class SelecionarOutroProdutoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  idFornecedor: number;
  idPedido: number;
  idProduto: number;

  itens: Array<CatalogoItem>;
  produtoExcluido: CatalogoItem;

  settings: CustomTableSettings;
  selecionado: CatalogoItem;

  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;

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

  constructor(
    private catalogoService: CatalogoService,
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.obterCatalogo();
  }

  cancelar() {
    this.activeModal.close();
  }

  selecao(item: CatalogoItem) {
    this.selecionado = item;
  }

  selecionar() {
    const uniqueCode = moment().format('x') + '_' + Math.random().toString(36).substr(2, 9);
    const pedidoItem = new PedidoItem(
      0, uniqueCode, this.idPedido, 0, 0, this.selecionado.contratoCatalogoItem.idContratoCatalogoItem,
      this.selecionado.contratoCatalogoItem, this.selecionado.contratoCatalogoItem.loteMinimo,
      moment().add(this.selecionado.contratoCatalogoItem.prazoEntrega, 'days').format('YYYY-MM-DD'),
      null, SituacaoPedidoItem.Ativo, null, this.selecionado.contratoCatalogoItem.valor, this.selecionado.contratoCatalogoItem.valor, this.selecionado.contratoCatalogoItem.quantidade,
      this.selecionado.contratoCatalogoItem.moeda,
      this.selecionado.contratoCatalogoItem.idMarca, this.selecionado.contratoCatalogoItem.marca, this.selecionado.contratoCatalogoItem.idProduto,
      this.selecionado.contratoCatalogoItem.produto, this.selecionado.contratoCatalogoItem.idFornecedor, this.selecionado.contratoCatalogoItem.garantia,
      this.selecionado.contratoCatalogoItem.frete, null, null, null, null, null, null, null, null, null, null, null,
    );
    this.activeModal.close(pedidoItem);
  }

  paginacao(event) {
    this.registrosPorPagina = event.recordsPerPage;
    this.pagina = event.page;
    this.obterCatalogo();
  }

  private obterCatalogo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService.filtrar(this.registrosPorPagina, this.pagina, 'pt.Descricao', 'ASC', '', new Array<Number>(), new Array<Number>(), new Array<Number>(this.idFornecedor), new Array<Number>()).subscribe(
      (response) => {
        if (response && response.itens.length) {
          this.itens = response.itens;
          this.produtoExcluido = this.itens.find((item) => item.contratoCatalogoItem.produto.idProduto == this.idProduto);

          this.itens = this.itens.filter((item) => item.contratoCatalogoItem.idProduto !== this.idProduto && item.contratoCatalogoItem.produto.idCategoriaProduto == this.produtoExcluido.contratoCatalogoItem.produto.idCategoriaProduto);

          if (this.itens.length == 0) {
            this.toastr.warning('Não há outros produtos da mesma categoria para este fornecedor no momento');
          }

          this.totalPaginas = response.numeroPaginas;
        } else {
          this.itens = new Array<CatalogoItem>();
          this.totalPaginas = 1;
          this.toastr.warning('Não há outros produtos deste fornecedor no momento');
          this.cancelar();
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Produto', 'contratoCatalogoItem.produto.descricao', CustomTableColumnType.text),
        new CustomTableColumn('Fornecedor', 'contratoCatalogoItem.fornecedor.razaoSocial', CustomTableColumnType.text),
        new CustomTableColumn('Marca', 'contratoCatalogoItem.marca.nome', CustomTableColumnType.text),
        new CustomTableColumn('Lote mínimo', 'contratoCatalogoItem.loteMinimo', CustomTableColumnType.text),
        new CustomTableColumn('Valor', 'contratoCatalogoItem.valor', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
        new CustomTableColumn('Unid. medida', 'contratoCatalogoItem.produto.unidadeMedida.sigla', CustomTableColumnType.text),
      ], 'radio',
    );
  }
}
