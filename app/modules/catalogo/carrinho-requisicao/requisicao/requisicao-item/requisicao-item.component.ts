import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Marca, Produto } from '@shared/models';
import { OrigemProgramacaoDeEntrega } from '@shared/models/enums/origem-programacao-de-entrega.enum';
import { RequisicaoItem } from '@shared/models/requisicao/requisicao-item';
import { MarcaService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ResumoCarrinhoComponent } from 'src/app/modules/container/resumo-carrinho/resumo-carrinho.component';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ConfiguracoesEntregasProgramadas } from '../../../../../shared/models/configuracoes-entregas-programadas';
import { EntregaProgramada } from '../../../../../shared/models/entrega-programada';
import { RequisicaoService } from '../../../../../shared/providers/requisicao.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'requisicao-item',
  templateUrl: './requisicao-item.component.html',
  styleUrls: ['./requisicao-item.component.scss'],
})
export class RequisicaoItemComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  @Input() requisicaoItem: RequisicaoItem;
  @Input() index: string;
  @Input() empresaSolicitanteHabilitadaParaIntegracaoErp: boolean;

  @Input() textoNgSelectLoading: string;
  @Input() textoNgSelectLimpar: string;
  @Input() textoNgSelectPlaceholder: string;

  // tslint:disable-next-line: no-output-rename
  @Output('atualizar-carrinho') atualizarCarrinho = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('item-alterado') itemAlterado = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('copiar') copiarEvent: EventEmitter<RequisicaoItem> = new EventEmitter<RequisicaoItem>();
  // tslint:disable-next-line: no-output-rename
  @Output('removerItem') removerItemEvent: EventEmitter<RequisicaoItem> = new EventEmitter<RequisicaoItem>();
  @Output('itemSelecionado') itemSelecionado = new EventEmitter<RequisicaoItem>();
  max = 999999999;
  min = 1;

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
    integerLimit: 9,
  });

  marcas: Marca[];
  valor: string;

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9,
  });

  formComentario: FormGroup = this.fb.group({
    observacao: [''],
  });

  modalRef: any;

  origemProgramacaoDeEntrega = OrigemProgramacaoDeEntrega;

  constructor(
    private marcarService: MarcaService,
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private requisicaoService: RequisicaoService,
    private currencyPipe: CurrencyPipe,
  ) {
    super();
  }

  async ngOnInit() {
    this.marcas = await this.marcarService.listar().toPromise();

    if (this.requisicaoItem.valorReferencia) {
      this.valor = this.adicionarMascaras(this.requisicaoItem.valorReferencia);
    } else {
      this.valor = '0,00';
    }

    this.habilitarLoteMinimo(this.requisicaoItem.produto);
  }

  ngOnDestroy(): void {
    this.copiarEvent.unsubscribe();
    this.removerItemEvent.unsubscribe();
    super.ngOnDestroy();
  }

  copiar() {
    const novaRequisicao = this.clone<RequisicaoItem>(this.requisicaoItem);
    novaRequisicao.idRequisicaoItem = 0;
    this.copiarEvent.emit(novaRequisicao);
  }

  remover() {

  }

  alterarItem(atualizarComEntregaProgramada: boolean = false) {
    this.itemAlterado.emit('salvando');
    this.requisicaoItem.quantidadeRestante = this.requisicaoItem.quantidade;

    const callbackSucesso: () => void = () => {
      this.itemAlterado.emit(moment().format());
      this.atualizarCarrinho.emit();
    };

    const callbackErro: () => void = () => {
      this.requisicaoItem.ultimaAlteracao = 'erro';
      this.itemAlterado.emit('erro');
    };

    if (atualizarComEntregaProgramada) {
      this.requisicaoService.alterarEntregaProgramada(this.requisicaoItem).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              this.requisicaoItem.dataEntrega = response.dataEntrega;
              this.requisicaoItem.quantidade = response.quantidade;
              this.requisicaoItem.valorReferencia = response.valorReferencia;
              callbackSucesso();
            }
          },
          () => callbackErro());
    } else {
      this.requisicaoService.alterarItem(this.requisicaoItem).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response) {
              callbackSucesso();
            }
          },
          () => callbackErro());
    }
  }

  atualizaSelecionados(requisicaoItem: RequisicaoItem) {
    this.itemSelecionado.emit(requisicaoItem);
  }

  atualizeProgramacaoDeEntregas(entregasProgramadas: Array<EntregaProgramada>) {
    this.requisicaoItem.datasDasEntregasProgramadas = entregasProgramadas;
    this.alterarItem(true);
  }

  configEntregaProgramada(
    index: number,
    origem: OrigemProgramacaoDeEntrega,
    idItem: number,
    dataEntregaMinima: number,
    quantidadeMinima: number,
    quantidadeMaxima: number,
    quantidadeMinimaDoLote: number,
    valorMascara: any,
    empresaComIntegracaoErp: boolean,
    permiteQuantidadeFracionada: boolean,
    valorReferencia: number,
  ) {
    return new ConfiguracoesEntregasProgramadas({
      index,
      origem,
      idItem,
      dataEntregaMinima,
      quantidadeMinima,
      quantidadeMaxima,
      quantidadeMinimaDoLote,
      valorMascara,
      empresaComIntegracaoErp,
      permiteQuantidadeFracionada,
      valorFixo: valorReferencia,
    });
  }

  solicitarRemoverItem() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      async (result) => {
        this.blockUI.start();
        this.requisicaoService.deletarItem(this.requisicaoItem).pipe(
          takeUntil(this.unsubscribe))
          .subscribe(
            (response) => {
              if (response && response > 0) {
                ResumoCarrinhoComponent.atualizarCarrinho.next();
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                this.atualizarCarrinho.emit();
                this.removerItemEvent.emit(this.requisicaoItem);
              } else {
                this.toastr.error('Falha ao remover item.');
              }
              this.blockUI.stop();
            },
            () => {
              this.blockUI.stop();
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            },
          );
      },
      (reason) => { },
    );
  }

  clone<T>(obj): T {
    if (null == obj || 'object' !== typeof obj) { return obj; }
    return <T>JSON.parse(JSON.stringify(obj));
  }

  onModelChange(valor: string) {
    this.valor = valor;
    this.requisicaoItem.valorReferencia = Number(this.valor.replace(/\./g, '').replace(',', '.'));
  }

  inserirComentario(content: any) {
    this.formComentario.patchValue({ observacao: this.requisicaoItem.observacao });
    this.modalRef = this.modalService.open(content, { centered: true });
  }

  solicitarSalvarComentario() {
    const anteriorVazio = this.requisicaoItem.observacao ? this.requisicaoItem.observacao.trim() === '' : true;
    const posteriorVazio = this.formComentario.value.observacao ? this.formComentario.value.observacao.trim() === '' : true;

    if (!anteriorVazio && posteriorVazio) {
      const confirmacaoRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

      confirmacaoRef.componentInstance.confirmacao = 'Você removeu o comentário, tem certeza que deseja salvar a alteração?';

      confirmacaoRef.result.then(
        (result) => {
          if (result) {
            this.salvarComentario();
          }
        },
      );
    } else {
      this.salvarComentario();
    }
  }

  async salvarComentario() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.requisicaoItem.observacao = this.formComentario.value.observacao;

    this.requisicaoService.comentarItem(this.requisicaoItem.idRequisicaoItem, this.requisicaoItem.observacao).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.modalRef.close();
          this.formComentario.reset();
          this.requisicaoItem.ultimaAlteracao = moment().format();
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private habilitarLoteMinimo(produto: Produto) {
    if (produto && produto.unidadeMedida && produto.unidadeMedida.permiteQuantidadeFracionada) {
      this.min = 0.0001;
      this.max = 999999999.9999;
    } else {
      this.min = 1;
      this.max = 999999999;
    }
  }

  private adicionarMascaras(valor: number) {
    const valorComMascara: string = this.currencyPipe.transform(valor, undefined, '', '1.2-4', 'pt-BR').trim();
    return valorComMascara;
  }
}
