import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ModalConfirmacaoExclusao } from '../../../../shared/components/modals/confirmacao-exclusao/confirmacao-exclusao.component';
import { ConfirmacaoComponent } from '../../../../shared/components/modals/confirmacao/confirmacao.component';
import { Moeda } from '../../../../shared/models/enums/moeda';
import { Marca } from '../../../../shared/models/marca';
import { Produto } from '../../../../shared/models/produto';
import { RegularizacaoItem } from '../../../../shared/models/regularizacao/regularizacao-item';
import { RegularizacaoService } from '../../../../shared/providers/regularizacao.service';
import { TranslationLibraryService } from '../../../../shared/providers/translation-library.service';
import { ResumoCarrinhoComponent } from '../../../container/resumo-carrinho/resumo-carrinho.component';

@Component({
  selector: 'smk-regularizacao-item',
  templateUrl: './regularizacao-item.component.html',
  styleUrls: ['./regularizacao-item.component.scss'],
})
export class RegularizacaoItemComponent extends Unsubscriber implements OnInit, OnDestroy {

  @BlockUI() blockUI: NgBlockUI;

  @Input() index: string;
  @Input() regularizacaoItem: RegularizacaoItem;
  @Input() moeda: Moeda;
  @Input() marcas: Array<Marca>;
  @Input() marcasLoading: boolean;
  @Input() textoNgSelectLoading: string;
  @Input() textoNgSelectLimpar: string;
  @Input() textoNgSelectPlaceholder: string;

  @Output() atualizarCarrinho = new EventEmitter();
  @Output() itemAlterado = new EventEmitter();
  @Output() removerItem: EventEmitter<RegularizacaoItem> = new EventEmitter<RegularizacaoItem>();
  @Output() itemSelecionado = new EventEmitter<RegularizacaoItem>();

  max = 999999999;
  min = 1;
  valor: string;

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

  formObservacoes: FormGroup = this.fb.group({
    observacao: [''],
  });

  constructor(
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private regularizacaoService: RegularizacaoService,
    private currencyPipe: CurrencyPipe,
  ) {
    super();
  }

  ngOnInit() {
    if (this.regularizacaoItem.valorUnitario) {
      this.valor = this.adicionarMascaras(this.regularizacaoItem.valorUnitario);
    } else {
      this.valor = '0,00';
    }

    this.habilitarLoteMinimo(this.regularizacaoItem.produto);
  }

  ngOnDestroy(): void {
    this.removerItem.unsubscribe();
    super.ngOnDestroy();
  }

  alterarItem() {
    this.itemAlterado.emit('salvando');

    this.regularizacaoService.putItem(this.regularizacaoItem).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.itemAlterado.emit(moment().format());
            this.atualizarCarrinho.emit();
          }
        },
        () => {
          this.regularizacaoItem.ultimaAlteracao = 'erro';
          this.itemAlterado.emit('erro');
        });
  }

  solicitarRemoverItem() {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => {
        this.blockUI.start();
        this.regularizacaoService.deleteItem(this.regularizacaoItem.idRegularizacaoItem).pipe(
          takeUntil(this.unsubscribe),
          finalize(() => this.blockUI.stop()))
          .subscribe(
            (response: number) => {
              if (response && response > 0) {
                ResumoCarrinhoComponent.atualizarCarrinho.next();
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
                this.atualizarCarrinho.emit();
                this.removerItem.emit(this.regularizacaoItem);
              } else {
                this.toastr.error('Falha ao remover item.');
              }
            },
            () => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            },
          );
      },
      (reason) => { },
    );
  }

  onModelChange(valor: string) {
    this.valor = valor;
    this.regularizacaoItem.valorUnitario = Number(this.valor.replace(/\./g, '').replace(',', '.'));
  }

  abrirObservacoes(content: any) {
    this.formObservacoes.patchValue({ observacao: this.regularizacaoItem.observacao });

    const modalRef = this.modalService.open(content, { centered: true });

    modalRef.result.then(
      (result) => {
        if (result) {
          const anteriorVazio = this.regularizacaoItem.observacao ? this.regularizacaoItem.observacao.trim() === '' : true;
          const posteriorVazio = this.formObservacoes.value.observacao ? this.formObservacoes.value.observacao.trim() === '' : true;

          if (!anteriorVazio && posteriorVazio) {
            const confirmacaoRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

            confirmacaoRef.componentInstance.confirmacao = 'Você removeu as observações, tem certeza que deseja salvar esta alteração?';

            confirmacaoRef.result.then(
              (resultConfirmacao) => {
                if (resultConfirmacao) {
                  this.atualizarObservacao();
                }
              },
            );
          } else {
            this.atualizarObservacao();
          }
        }

      },
      (reason) => { },
    );
  }

  obtenhaValorTotal(): number {
    if (this.regularizacaoItem && this.regularizacaoItem.valorUnitario && this.regularizacaoItem.quantidade) {
      return this.regularizacaoItem.valorUnitario * this.regularizacaoItem.quantidade;
    } else {
      return 0;
    }
  }

  private atualizarObservacao() {
    this.regularizacaoItem.observacao = this.formObservacoes.value.observacao;
    this.alterarItem();
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

  atualizaSelecionados(regularizacaoItem: RegularizacaoItem) {
    this.itemSelecionado.emit(regularizacaoItem);
  }

}
