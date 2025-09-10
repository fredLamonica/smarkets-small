import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { PedidoTramite, SituacaoPedido } from '@shared/models';
import { PedidoItemRecebimento } from '@shared/models/pedido/pedido-item-recebimento';
import { PedidoItemRecebimentoHistorico } from '@shared/models/pedido/pedido-item-recebimento-historico';
import { TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PedidoExibicaoDto } from '../../../../shared/models/pedido/pedido-exibicao-dto';
import { PedidoItemProdutoDto } from '../../../../shared/models/pedido/pedido-item-produto-dto';
import { PedidoItemServicoDto } from '../../../../shared/models/pedido/pedido-item-servico-dto';
import { PedidoService } from '../../../../shared/providers/pedido.service';
import { ReceberPedidoJustificativaComponent } from '../receber-pedido-justificativa/receber-pedido-justificativa.component';

@Component({
  selector: 'receber-pedido',
  templateUrl: './receber-pedido.component.html',
  styleUrls: ['./receber-pedido.component.scss'],
})
export class ReceberPedidoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() pedido: PedidoExibicaoDto;

  pedidoItemRecebimento = new Array<PedidoItemRecebimento>();

  dataRecebimento: string = moment().format('YYYY-MM-DD');
  notaFiscal: string;

  pedidoItensRecebimentoExistente = new Array<PedidoItemRecebimento>();

  constructor(
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.montarPedidoItemRecebimento();

    this.obterPedidoItemRecebimento();
  }

  calculaQuantidadeSaldo(pedidoItemRecebimento: PedidoItemRecebimento) {
    return (pedidoItemRecebimento.quantidadeSaldo +=
      pedidoItemRecebimento.quantidadePedidoItem - pedidoItemRecebimento.quantidadeRecebida);
  }

  preencherTodoSaldo() {
    const temItem = this.pedidoItemRecebimento.some((p) => p.quantidadeSaldo > 0);

    if (temItem) {
      this.pedidoItemRecebimento.forEach((item) => {
        if (item.quantidadeSaldo > 0) {
          item.quantidadeRecebida = item.quantidadeSaldo;
        }
      });
    }
  }

  bloquearInput(pedidoItemRecebimento: PedidoItemRecebimento): boolean {
    if (pedidoItemRecebimento.quantidadeSaldo <= 0) { return true; }

    return false;
  }

  solicitarReceberPedido() {
    const pedidoItens = this.pedidoItemRecebimento.filter(
      (p) => p.quantidadeRecebida != null && p.quantidadeRecebida > 0,
    );

    if (pedidoItens.length > 0 && this.validaRecebimento(pedidoItens)) {
      this.receberPedido(pedidoItens);
    }
  }

  cancelarSaldo() {
    if (!this.dataRecebimento || this.dataRecebimento === '' || !this.notaFiscal || this.notaFiscal.trim() === '') {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    const modalRef = this.modalService.open(ReceberPedidoJustificativaComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.result.then((result) => {
      if (result) {
        this.receberPedidoJustificava(result);

        this.confirmar();
      }
    });
  }

  receberPedidoJustificava(justificativa: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const tramite = new PedidoTramite(
      0,
      this.pedido.idPedido,
      SituacaoPedido.Entregue,
      0,
      moment().format(),
      justificativa,
      null,
    );

    if (!this.dataRecebimento || this.dataRecebimento === '' || !this.notaFiscal || this.notaFiscal.trim() === '') {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    this.pedidoService.cancelarSaldoPedido(tramite, this.notaFiscal).subscribe(
      (response) => {
        this.pedido.situacao = response.situacao;
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  cancelar() {
    this.activeModal.close(false);
  }

  confirmar() {
    this.activeModal.close(this.pedido);
  }
  private obterPedidoItemRecebimento() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedidoService.obterSaldoPedidoItensRecebido(this.pedido.idPedido).subscribe(
      (response) => {
        this.blockUI.stop();
        this.pedidoItensRecebimentoExistente = response;
        this.tratarItensObtidos();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private tratarItensObtidos() {
    this.pedidoItemRecebimento.forEach((item) => {
      const idsExistentente = this.pedidoItensRecebimentoExistente.map((p) => p.idPedidoItem);
      if (idsExistentente.includes(item.idPedidoItem)) {
        item.quantidadeSaldo = this.pedidoItensRecebimentoExistente.find(
          (q) => q.idPedidoItem === item.idPedidoItem,
        ).quantidadeSaldo;
      } else {
        item.quantidadeSaldo = item.quantidadePedidoItem;
      }
    });
  }

  private montarPedidoItemRecebimento() {
    this.pedido.itensProduto.forEach((item) => {
      this.pedidoItemRecebimento.push(this.instanciarPedidoItemProduto(item));
    });
    this.pedido.itensServico.forEach((item) => {
      this.pedidoItemRecebimento.push(this.instanciarPedidoItemServico(item));
    });
  }

  private instanciarPedidoItemProduto(pedidoItem: PedidoItemProdutoDto): PedidoItemRecebimento {
    return new PedidoItemRecebimento(
      pedidoItem.idPedidoItem,
      pedidoItem.produto.descricao,
      pedidoItem.quantidade,
      0,
      null,
      0,

    );
  }

  private instanciarPedidoItemServico(pedidoItem: PedidoItemServicoDto): PedidoItemRecebimento {
    return new PedidoItemRecebimento(
      pedidoItem.idPedidoItem,
      pedidoItem.produto.descricao,
      pedidoItem.quantidade,
      0,
      null,
      0,

    );
  }

  private receberPedido(pedidoItens: Array<PedidoItemRecebimento>) {
    // Valida Quantidade Recebida
    const quantidadeRecebidaMaiorSolicitada = this.pedidoItemRecebimento.some(
      (p) => p.quantidadeRecebida > p.quantidadePedidoItem,
    );

    if (quantidadeRecebidaMaiorSolicitada) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, {
        centered: true,
        backdrop: 'static',
      });

      modalRef.componentInstance.confirmacao = `Você deseja receber mais itens que o disponível?`;
      modalRef.result.then((result) => {
        if (result) { this.confirmarRebimento(pedidoItens); }
      });
    }
    // END  Valida Quantidade Recebida

    if (!quantidadeRecebidaMaiorSolicitada) {
      this.confirmarRebimento(pedidoItens);
    }
  }

  private confirmarRebimento(pedidoItens: Array<PedidoItemRecebimento>) {
    const pedidoItemRecebimento = this.montarRecebimento(pedidoItens);

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedidoService.receberPedidoItens(pedidoItemRecebimento).subscribe(
      (response) => {
        this.pedido.situacao = response.situacao;
        this.blockUI.stop();
        this.confirmar();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private montarRecebimento(pedidopedidoItemRecebimentoItens: Array<PedidoItemRecebimento>) {
    const dataRecebimento = this.datePipe.transform(this.dataRecebimento, 'MMM d, y');
    const pedidoItemRecebimentoHistorico = new PedidoItemRecebimentoHistorico(
      this.pedido.idPedido,
      this.notaFiscal,
      new Date(dataRecebimento),
    );
    pedidopedidoItemRecebimentoItens.map(
      (p) => (p.pedidoItemRecebimentoHistorico = pedidoItemRecebimentoHistorico),
    );
    return pedidopedidoItemRecebimentoItens;
  }

  private validaRecebimento(pedidoItensReceber: Array<PedidoItemRecebimento>): boolean {
    if (
      !this.dataRecebimento ||
      this.dataRecebimento === '' ||
      !this.notaFiscal ||
      this.notaFiscal.trim() === ''
    ) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }
}
