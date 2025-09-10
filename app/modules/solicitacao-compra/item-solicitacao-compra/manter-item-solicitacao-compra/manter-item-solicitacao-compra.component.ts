import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import {
  ItemSolicitacaoCompra,
  ItemSolicitacaoCompraComentario,
  Arquivo,
  Moeda
} from '@shared/models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {
  TranslationLibraryService,
  ArquivoService,
  SolicitacaoCompraService,
  MaskService
} from '@shared/providers';
import { FormBuilder, FormGroup } from '@angular/forms';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';

import * as moment from 'moment';
import { ItemSolicitacaoCompraRateio } from '@shared/models/solicitacao-compra/item-solicitacao-compra-rateio';

@Component({
  selector: 'app-manter-item-solicitacao-compra',
  templateUrl: './manter-item-solicitacao-compra.component.html',
  styleUrls: ['./manter-item-solicitacao-compra.component.scss']
})
export class ManterItemSolicitacaoCompraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public Moeda = Moeda;

  public itemSolicitacaoCompra: ItemSolicitacaoCompra;

  public form: FormGroup;

  public maskDecimal = createNumberMask({
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
    integerLimit: 12
  });

  constructor(
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private arquivoService: ArquivoService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private maskService: MaskService
  ) {}

  ngOnInit() {
    this.construirFormulario();
    this.preencherFormulario(this.itemSolicitacaoCompra);
  }

  public construirFormulario() {
    this.form = this.formBuilder.group({
      idItemSolicitacaoCompra: [0],
      idTenant: [0],
      codigo: [null],
      idSolicitacaoCompra: [0],
      codigoSolicitacaoCompra: [null],
      descricao: [null],
      codigoComprador: [null],
      codigoContrato: [null],
      infoRequisitante: [null],
      nomeProduto: [null],
      descricaoProduto: [null],
      codigoProduto: [null],
      tipoProduto: [null],
      utilizacaoProduto: [null],
      codigoOrigemProduto: [null],
      ncm: [null],
      codigoFilialEmpresa: [null],
      codigoEmpresa: [null],
      codigoDeposito: [null],
      codigoCategoria: [null],
      nomeCategoria: [null],
      quantidade: [0],
      siglaUnidadeMedida: [null],
      descricaoUnidadeMedida: [null],
      dataRemessa: [null],
      valorReferencia: [0],
      quantidadeUnidadesPreco: [0],
      tipoItem: [null],
      codigoClassificacaoContabil: [null],
      fornecedorFixo: [null],
      moeda: [null],
      previsaoEntregaDias: [0],
      numeroPacote: [null],
      codigoImobilizado: [null],
      subNumeroImobilizado: [null],
      nomeImobilizado: [null],
      ordem: [null],
      elementoPep: [null],
      diagramaRede: [null],
      pessoaJuridica: [null],
      anexos: [new Array<Arquivo>()],
      comentarios: [new Array<ItemSolicitacaoCompraComentario>()],
      previsaoEntrega: [null],
      razaoSocial: [null],
      cnpj: [null],
      rateios: [new Array<ItemSolicitacaoCompraRateio>()]
    });
  }

  public preencherFormulario(itemSolicitacaoCompra: ItemSolicitacaoCompra) {
    this.form.patchValue(itemSolicitacaoCompra);
    this.form.patchValue({
      previsaoEntrega: moment(itemSolicitacaoCompra.dataRemessa)
        .add(itemSolicitacaoCompra.previsaoEntregaDias, 'days')
        .format(),
      razaoSocial: itemSolicitacaoCompra.pessoaJuridica
        ? itemSolicitacaoCompra.pessoaJuridica.razaoSocial
        : '',
      cnpj: itemSolicitacaoCompra.pessoaJuridica ? itemSolicitacaoCompra.pessoaJuridica.cnpj : '',
      dataRemessa: moment(itemSolicitacaoCompra.dataRemessa).format('DD/MM/YYYY'),
      moeda: +itemSolicitacaoCompra.moeda,
      quantidade: this.maskService.addDecimalMask(itemSolicitacaoCompra.quantidade)
    });
    this.obterAnexos();
    this.form.disable();
  }

  public isRateioVisible(itensRateio: Array<ItemSolicitacaoCompraRateio>): boolean {
    if (itensRateio && itensRateio.length > 0) return true;
    return false;
  }

  public obterAnexos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .obterArquivosPorItem(
        this.itemSolicitacaoCompra.idSolicitacaoCompra,
        this.itemSolicitacaoCompra.idItemSolicitacaoCompra
      )
      .subscribe(
        response => {
          if (response) this.form.patchValue({ anexos: response });
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  // #region Arquivos
  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      await this.solicitacaoCompraService
        .inserirArquivosItem(
          this.itemSolicitacaoCompra.idSolicitacaoCompra,
          this.itemSolicitacaoCompra.idItemSolicitacaoCompra,
          arquivos
        )
        .toPromise();
      this.form.patchValue({
        anexos: this.form.controls.anexos.value.concat(arquivos)
      });
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public async excluirArquivo(arquivo) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService
      .deletarArquivoItem(
        this.itemSolicitacaoCompra.idSolicitacaoCompra,
        this.itemSolicitacaoCompra.idItemSolicitacaoCompra,
        this.form.controls.anexos.value[arquivo.index].idArquivo
      )
      .subscribe(
        response => {
          let anexos = this.form.controls.anexos.value;
          anexos.splice(arquivo.index, 1);
          this.form.patchValue({
            anexos: anexos
          });
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }
  // #endregion

  public fechar() {
    this.activeModal.close();
  }
}
