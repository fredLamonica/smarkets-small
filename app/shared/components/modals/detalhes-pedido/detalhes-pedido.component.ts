import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components/modals/confirmacao-exclusao/confirmacao-exclusao.component';
import { CustomTableSettings, Pedido, PedidoItem, SituacaoPedido, SituacaoPedidoItem, TipoFrete } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { PedidoService } from '../../../providers/pedido.service';
import { UtilitiesService } from '../../../utils/utilities.service';

@Component({
  selector: 'app-detalhes-pedido',
  templateUrl: './detalhes-pedido.component.html',
  styleUrls: ['./detalhes-pedido.component.scss'],
})
export class DetalhesPedidoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('pedido') pedido: Pedido;

  Situacao = SituacaoPedido;
  Frete = TipoFrete;

  settings: CustomTableSettings;

  // #region edicao
  itemEditado: boolean;
  modalItem: any;
  itemSelecionado: PedidoItem;
  form: FormGroup;

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
    private pedidoService: PedidoService,
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private utilitiesService: UtilitiesService,
  ) { }

  ngOnInit() {
    this.pedido = this.calcularValorTotalItens(this.pedido);
  }

  confirmarPedido() {
    this.activeModal.close(SituacaoPedido['Aguardando fornecedor']);
  }

  editarItem(content, item: PedidoItem) {
    this.itemSelecionado = item;
    this.contruirFormularioItem();
    this.preencherFormularioItem(item);
    this.modalItem = this.modalService.open(content, { centered: true, size: 'lg' });
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const itemEditado = this.form.value;
    if (this.formularioValido) {
      if (itemEditado.quantidade !== this.itemSelecionado.quantidade || itemEditado.dataEntrega !== this.itemSelecionado.dataEntrega) {
        this.itemEditado = true;
      }
      const index = this.pedido.itens.findIndex((item) => item.idPedidoItem === itemEditado.idPedidoItem);
      if (index !== -1) {
        const item = this.pedido.itens.splice(index, 1)[0];
        item.idPedidoItemPai = item.idPedidoItem;
        item.idPedidoItem = 0;
        item.quantidade = +itemEditado.quantidade;
        item.dataEntrega = itemEditado.dataEntrega;
        item.situacao = SituacaoPedidoItem.Ativo;
        this.pedido.itens.push(item);
      }

      this.pedido = this.calcularValorTotalItens(this.pedido);
      this.modalItem.close();
      this.blockUI.stop();
    } else {
      this.blockUI.stop();
    }
  }

  formularioValido(): boolean {
    if (this.form.controls.quantidade.invalid) {
      if (this.form.controls.quantidade.errors.min) {
        this.toastr.warning('Menor valor permitido para quantidade é 0');
      } else if (this.form.controls.quantidade.errors.max) {
        this.toastr.warning('Maior valor permitido para quantidade é 2000000000');
      }
      return false;
    }

    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }
  // #endregion

  // #region Remover item
  solicitarExclusaoItem(idPedidoItem: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluirItem(idPedidoItem),
      (reason) => { });
  }

  obtenhaDataDeEntrega(pedidoItem: PedidoItem): string {
    return this.utilitiesService.obtenhaDataDeEntrega(pedidoItem);
  }

  private calcularValorTotalItens(pedido: Pedido): Pedido {
    pedido.itens.forEach((item) => item.valorTotal = (item.quantidade * item.valor));
    return pedido;
  }

  private contruirFormularioItem() {
    this.form = this.formBuilder.group({
      idPedidoItem: [0],
      codigo: [0],
      idPedido: [0],
      idUsuario: [0],
      idTenant: [0],
      idContratoCatalogoItem: [0],
      contratoCatalogoItem: [null],
      quantidade: [0, Validators.compose([Validators.required, Validators.min(0), Validators.max(2000000000)])],
      dataEntrega: [0, Validators.required],
      situacao: [null],
      idPedidoItemPai: [null],
      produto: [''],
      marca: [''],
      unidadeMedida: [''],
      valor: [0],
    });
  }

  private preencherFormularioItem(item: PedidoItem) {
    this.form.patchValue(item);
    this.form.patchValue({
      dataEntrega: this.datePipe.transform(item.dataEntrega, 'yyyy-MM-dd'),
      produto: item.produto.descricao,
      marca: item.marca ? item.marca.nome : '',
      unidadeMedida: item.produto.unidadeMedida.descricao,
      valor: item.valor,
    });
  }

  private excluirItem(idPedidoItem: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const index = this.pedido.itens.findIndex((item) => item.idPedidoItem === idPedidoItem);
    if (index !== -1) {
      const idPedido = this.pedido.itens[index].idPedido;
      const idFornecedor = this.pedido.idFornecedor;
      this.pedidoService.alterarItemSituacao(idPedido, idPedidoItem, SituacaoPedidoItem.Cancelado).subscribe(
        (response) => {
          this.pedido.itens = this.pedido.itens.filter((item) => item.idPedidoItem !== idPedidoItem);
          if (!this.pedido.itens.length) {
            this.activeModal.close(this.pedido);
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.blockUI.stop();
    }
  }
  // #endregion
}
