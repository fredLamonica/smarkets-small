import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CatalogoItem, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Pedido, PedidoItem, SituacaoPedidoItem } from '@shared/models';
import { CatalogoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { PedidoService } from '../../../shared/providers/pedido.service';
import { ResumoCarrinhoComponent } from '../../container/resumo-carrinho/resumo-carrinho.component';

@Component({
  selector: 'app-selecionar-outro-fornecedor',
  templateUrl: './selecionar-outro-fornecedor.component.html',
  styleUrls: ['./selecionar-outro-fornecedor.component.scss'],
})
export class SelecionarOutroFornecedorComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  idProduto: number;
  idFornecedor: number;
  pedido: Pedido;
  novoPedido: Pedido;

  itens: Array<CatalogoItem>;

  settings: CustomTableSettings;
  selecionado: CatalogoItem;

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

  private modalRef: any;
  private idPrePedidoCriado: number;

  constructor(
    private catalogoService: CatalogoService,
    private pedidoService: PedidoService,
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private router: Router,
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

  selecionar(content) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.selecionado) {
      const pedidoItem = new PedidoItem(
        0, '', 0, 0, 0, this.selecionado.contratoCatalogoItem.idContratoCatalogoItem, this.selecionado.contratoCatalogoItem,
        this.selecionado.contratoCatalogoItem.loteMinimo, null, null, SituacaoPedidoItem.Ativo, null, this.selecionado.contratoCatalogoItem.valor, this.selecionado.contratoCatalogoItem.valor, this.selecionado.contratoCatalogoItem.valor * this.selecionado.contratoCatalogoItem.quantidade,
        this.selecionado.contratoCatalogoItem.moeda, this.selecionado.contratoCatalogoItem.idMarca, this.selecionado.contratoCatalogoItem.marca,
        this.selecionado.contratoCatalogoItem.idProduto, this.selecionado.contratoCatalogoItem.produto, this.selecionado.contratoCatalogoItem.idFornecedor,
        this.selecionado.contratoCatalogoItem.garantia, this.selecionado.contratoCatalogoItem.frete, null, null, null, null, null, null, null,
        null, null, null, null,
      );

      this.pedidoService.inserirItem(pedidoItem).subscribe(
        (response) => {
          ResumoCarrinhoComponent.atualizarCarrinho.next();

          this.idPrePedidoCriado = response.idPedido;

          this.toastr.success('Pré-pedido adicionado ao carrinho, é necessário confirma-lo para envia-lo ao fornecedor');
          this.blockUI.stop();

          this.proximaAcao(content);
        }, (error) => {
          this.blockUI.stop();
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
    } else {
      this.blockUI.stop();
      this.toastr.warning('É necessário selecionar ao menos um produto para prosseguir');
    }
  }

  continuarRevisao() {
    this.modalRef.close();
    this.activeModal.close();
  }

  irCarrinho() {
    this.modalRef.close();
    this.activeModal.close();
    this.router.navigate(['/carrinho'], { queryParams: { idPrePedido: this.idPrePedidoCriado } });
  }

  salvarRevisaoIrCarrinho() {
    this.modalRef.close();
    this.activeModal.close(this.idPrePedidoCriado);
  }

  private obterCatalogo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.catalogoService.obterItemOutrosFornecedores(this.idProduto, this.idFornecedor).subscribe(
      (response) => {
        if (response && response.length) {
          this.itens = response;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.warning('Não há outros fornecedores desse produto no momento');
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

  private proximaAcao(content) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
  }

}
