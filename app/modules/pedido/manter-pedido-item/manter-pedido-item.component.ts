import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pedido, PedidoItem, RequisicaoItem, SituacaoPedidoItem } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ConfiguracoesEntregasProgramadas } from '../../../shared/models/configuracoes-entregas-programadas';
import { EntregaProgramada } from '../../../shared/models/entrega-programada';
import { OrigemProgramacaoDeEntrega } from '../../../shared/models/enums/origem-programacao-de-entrega.enum';
import { PedidoEntregasProgramadasService } from '../../../shared/providers/pedido-entregas-programadas.service';
import { PedidoService } from '../../../shared/providers/pedido.service';
import { ResumoCarrinhoComponent } from '../../container/resumo-carrinho/resumo-carrinho.component';

@Component({
  selector: 'app-manter-pedido-item',
  templateUrl: './manter-pedido-item.component.html',
  styleUrls: ['./manter-pedido-item.component.scss'],
})
export class ManterPedidoItemComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('pedido-item') pedidoItem: PedidoItem;

  prePedidos: Array<Pedido>;

  requisicaoItem: RequisicaoItem;

  origemProgramacaoDeEntrega = OrigemProgramacaoDeEntrega;

  form: FormGroup;

  min: number;
  max: 999999999.9999;

  private programacaoDeEntregasAlterada: boolean;

  constructor(
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService,
    private pedidoEntregasProgramadasService: PedidoEntregasProgramadasService,
    private pedidoService: PedidoService,
  ) {
    super();
  }

  ngOnInit() {
    if (this.pedidoItem && this.pedidoItem.idContratoCatalogoItem) {
      this.min = this.pedidoItem.contratoCatalogoItem.loteMinimo;
    } else if (
      this.pedidoItem &&
      this.pedidoItem.produto &&
      this.pedidoItem.produto.unidadeMedida &&
      this.pedidoItem.produto.unidadeMedida.permiteQuantidadeFracionada
    ) {
      this.min = 0.0001;
    } else {
      this.min = 1;
    }

    this.contruirFormularioItem();
    this.preencherFormularioItem(this.pedidoItem);
  }

  voltar() {
    this.activeModal.close(this.pedidoItem.entregaProgramada && this.programacaoDeEntregasAlterada ? this.pedidoItem : null);
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    const itemEditado = this.form.value;

    if (this.formularioValido) {
      if (itemEditado.quantidade === this.pedidoItem.quantidade && moment(itemEditado.dataEntrega).isSame(moment(this.pedidoItem.dataEntrega))) {
        this.blockUI.stop();
        this.voltar();
        return;
      }

      this.pedidoItem.quantidade = +itemEditado.quantidade;
      this.pedidoItem.dataEntrega = itemEditado.dataEntrega;
      this.pedidoItem.situacao = SituacaoPedidoItem.Ativo;

      this.activeModal.close(this.pedidoItem);
    }
    this.blockUI.stop();
  }

  configEntregaProgramada() {
    return new ConfiguracoesEntregasProgramadas({
      index: 1,
      origem: OrigemProgramacaoDeEntrega.pedido,
      idItem: this.pedidoItem.idPedidoItem ? this.pedidoItem.idPedidoItem : this.pedidoItem.idPedidoItemPai,
      quantidadeMinima: 1,
      quantidadeMaxima: this.max,
      quantidadeMinimaDoLote: this.pedidoItem.loteMinimo,
      valorFixo: this.pedidoItem.valor,
      permiteQuantidadeFracionada: this.pedidoItem.produto && this.pedidoItem.produto.unidadeMedida ? this.pedidoItem.produto.unidadeMedida.permiteQuantidadeFracionada : false,
      dataEntregaMinima: this.pedidoItem.minDataEntrega,
    });
  }

  atualizeProgramacaoDeEntregas(entregasProgramadas: Array<EntregaProgramada>, prePedidoIndex: number, itemIndex: number) {
    const pedidoItem = this.prePedidos[prePedidoIndex].itens[itemIndex];

    pedidoItem.datasDasEntregasProgramadas = entregasProgramadas;
    this.alterarItem(prePedidoIndex, itemIndex);

    this.pedidoEntregasProgramadasService.getUltimaDataProgramada(pedidoItem.idPedidoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((entregaProgramadaUltimaData) => pedidoItem.entregaProgramadaUltimaDataDto = entregaProgramadaUltimaData);
  }

  alterarItem(prePedidoIndex: number, itemIndex: number) {
    const order = this.prePedidos[prePedidoIndex];

    if (this.canEditOrder(order)) {
      this.prePedidos[prePedidoIndex].ultimaAlteracao = 'salvando';

      this.pedidoService.alterarItem(this.prePedidos[prePedidoIndex].idPedido, this.prePedidos[prePedidoIndex].itens[itemIndex]).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              this.prePedidos[prePedidoIndex].ultimaAlteracao = moment().format();
              ResumoCarrinhoComponent.atualizarCarrinho.next();
            }
          },
          (error) => {
            this.prePedidos[prePedidoIndex].ultimaAlteracao = 'erro';
          },
        );
    }
  }

  canEditOrder(order: Pedido): boolean {
    return order.idUsuario && order.idUsuario > 0;
  }

  entregasProgramadasAlteradas(entregasProgramadas: Array<EntregaProgramada>) {
    if (this.listasSaoDiferentes(entregasProgramadas, this.pedidoItem.datasDasEntregasProgramadas)) {
      this.programacaoDeEntregasAlterada = true;
      this.pedidoItem.situacao = SituacaoPedidoItem.Ativo;
      this.pedidoItem.datasDasEntregasProgramadas = entregasProgramadas;
    }
  }

  private listasSaoDiferentes(entregasProgramadasA: Array<EntregaProgramada>, entregasProgramadasB: Array<EntregaProgramada>): boolean {
    if (entregasProgramadasA.length !== entregasProgramadasB.length) {
      return true;
    }

    let listasSaoDiferentes: boolean = false;

    for (const entregaProgramadaA of entregasProgramadasA) {
      const entregaProgramadaB = entregasProgramadasB.find((x) => x.dataEntrega === entregaProgramadaA.dataEntrega);

      if (!entregaProgramadaB || entregaProgramadaB.quantidade !== entregaProgramadaA.quantidade) {
        listasSaoDiferentes = true;
        break;
      }
    }

    return listasSaoDiferentes;
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
      quantidade: [
        0,
        Validators.compose([
          Validators.required,
          Validators.min(this.min),
          Validators.max(999999999.9999),
        ]),
      ],
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
      produto: item.idProduto ? item.produto.descricao : item.descricao,
      marca: item.marca ? item.marca.nome : '',
      unidadeMedida:
        item.produto != null ? item.produto.unidadeMedida.descricao : 'Sem preferência',
      valor: item.valor,
    });
  }

  private formularioValido(): boolean {
    if (this.form.controls.quantidade.invalid) {
      if (this.form.controls.quantidade.errors.min) {
        this.toastr.warning('Menor valor permitido para quantidade é 0');
      } else if (this.form.controls.quantidade.errors.max) {
        this.toastr.warning('Maior valor permitido para quantidade é 999999999.9999');
      }
      return false;
    }

    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }
}
