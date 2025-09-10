import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Unsubscriber } from '../../../../../shared/components/base/unsubscriber';
import { SituacaoContratoCatalogoItem } from '../../../../../shared/models';
import { AprovacaoContratoCatalogoFaturamentoFornecedor } from '../../../../../shared/models/contrato-catalogo/aprovacao-contrato-catalogo-faturamento-fornecedor';
import { ContratoCatalogoFaturamento } from '../../../../../shared/models/contrato-catalogo/contrato-catalogo-faturamento';
import { AprovacaoItemContratoFornecedor } from '../../../../../shared/models/enums/aprovacao-item-contrato-fornecedor';
import { EnumToArrayPipe } from '../../../../../shared/pipes';
import { TranslationLibraryService } from '../../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../../shared/utils/error.service';

@Component({
  selector: 'smk-edite-faturamento-contrato-fornecedor',
  templateUrl: './edite-faturamento-contrato-fornecedor.component.html',
  styleUrls: ['./edite-faturamento-contrato-fornecedor.component.scss']
})
export class EditeFaturamentoContratoFornecedorComponent extends Unsubscriber implements OnInit {

  get getPermiteAtualizacao() {
    return this.contratoCatalogoFaturamento && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento != undefined ? true : false;
  }

  get getValorMinimo() {
    return this.contratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.valorMinimoPedido
      ? this.formatCurrency(this.contratoCatalogoFaturamento.valorMinimoPedido) : null;
  }

  get getValorMinimoAprovacao() {
    return this.contratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.valorMinimoPedido
      ? this.formatCurrency(this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.valorMinimoPedido) : null;
  }

  get getSituacaoFaturamento() {
    return this.contratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamentoOld
      ? this.getSituacaoEstadoNome(this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamentoOld) : null;
  }

  get getSituacaoFaturamentoAprovacao() {
    return this.contratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento
      && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamento
      ? this.getSituacaoEstadoNome(this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamento) : null;
  }

  get exibeValorMinimo() {
    if (this.contratoCatalogoFaturamento && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento == undefined)
      return true;

    if (this.habiliteEdicao)
      return true;

    return this.contratoCatalogoFaturamento && this.contratoCatalogoFaturamento.valorMinimoPedido === this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.valorMinimoPedido ? true : false;
  }

  get exibeSituacao() {
    if (this.contratoCatalogoFaturamento && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento == undefined)
      return true;

    if (this.habiliteEdicao)
      return true;

    return this.contratoCatalogoFaturamento
           && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento
           && this.contratoCatalogoFaturamento.situacao === this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamento ? true : false;
  }

  @BlockUI() blockUI: NgBlockUI;
  idContratoCatalogoFaturamento: number;
  form: FormGroup;
  contratoCatalogoFaturamento: ContratoCatalogoFaturamento;
  opcoesSituacaoCatalogoFaturamento: Array<{ index: number, name: string }>;
  item: AprovacaoContratoCatalogoFaturamentoFornecedor;
  habiliteEdicao: boolean = false;

  constructor(
    private fb: FormBuilder,
    private contratoCatalogoService: ContratoCatalogoService,
    private translationLibrary: TranslationLibraryService,
    private errorService: ErrorService,
    public activeModal: NgbActiveModal,
    private currencyPipe: CurrencyPipe,
    private toastr: ToastrService,
  ) {
    super()
  }

  ngOnInit() {
    this.construaForm();
    this.obtenhaPorId();
  }

  obtenhaPorId() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoCatalogoService.obtenhaFaturamentoContratoPorId(this.idContratoCatalogoFaturamento)
      .subscribe((result) => {
        if (result) {
          this.contratoCatalogoFaturamento = result;
          this.configureForm(result);
          this.blockUI.stop();
        }
      },
        (error) => {
          if (error) {
            this.errorService.treatError(error);
            this.blockUI.stop();
          }
        }
      )
  }

  atualizar() {
    this.habiliteEdicao = true;
    this.form.enable();
    this.form.setValue({
      nomeEstado: this.contratoCatalogoFaturamento.estado.nome,
      valorMinimoPedido: this.currencyPipe.transform(this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.valorMinimoPedido, undefined, '', '1.2-4', 'pt-BR').trim(),
      uf: this.contratoCatalogoFaturamento.estado.abreviacao,
      situacaoFaturamento: this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamento,
      idContratoCatalogoFaturamento: this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.idContratoCatalogoFaturamento
    });

    this.configureSituacao(this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamento);
  }

  salvar() {
    this.form.controls.uf.disable();
    this.form.controls.nomeEstado.disable();

    if (!this.habiliteEdicao)
      this.envieAprovacao();
    else
      this.editeAprovacao();
  }

  cancelar() {
    this.activeModal.close();
  }

  //#region GetValores

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, undefined, '', '1.2-4', 'pt-BR').trim();
  }

  getSituacaoEstadoNome(situacao: number): string {
    return SituacaoContratoCatalogoItem[situacao];
  }

  private configureSituacao(situacao: SituacaoContratoCatalogoItem) {
    this.opcoesSituacaoCatalogoFaturamento = new EnumToArrayPipe().transform(SituacaoContratoCatalogoItem) as Array<any>;

    if (situacao != SituacaoContratoCatalogoItem['Aguardando Aprovação']) {
      let filtro: (itemSituacao: { index: number, name: string }) => boolean;

      filtro = (itemSituacao: { index: number, name: string }) => {
        return itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Aprovação'] &&
          itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Exclusão'] &&
          itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Inclusão'] &&
          itemSituacao.index != SituacaoContratoCatalogoItem['Em edição'] &&
          itemSituacao.index != SituacaoContratoCatalogoItem.Aprovado &&
          itemSituacao.index != SituacaoContratoCatalogoItem.Recusado
      };

      this.opcoesSituacaoCatalogoFaturamento = this.opcoesSituacaoCatalogoFaturamento.filter((situacao) => filtro(situacao));
    }
  }

  private construaForm() {
    this.form = this.fb.group({
      nomeEstado: [null],
      valorMinimoPedido: [null],
      uf: [null],
      situacaoFaturamento: [null],
      idContratoCatalogoFaturamento: [null]
    })
  }

  private configureForm(result: ContratoCatalogoFaturamento) {

    this.form.patchValue({
      nomeEstado: result.estado.nome,
      valorMinimoPedido: this.currencyPipe.transform(result.valorMinimoPedido, undefined, '', '1.2-4', 'pt-BR').trim(),
      uf: result.estado.abreviacao,
      situacaoFaturamento: result.situacao,
      idContratoCatalogoFaturamento: result.idContratoCatalogoFaturamento
    });

    this.configureSituacao(result.situacao);

    if (result.aprovacaoContratoCatalogoFaturamento != null
        && result.aprovacaoContratoCatalogoFaturamento.situacao == AprovacaoItemContratoFornecedor.AguardandoAprovacao) {
      this.form.disable();
    }
  }

  private envieAprovacao() {
    if (this.form.controls.situacaoFaturamento.value == SituacaoContratoCatalogoItem['Aguardando Aprovação']) {
      this.toastr.warning("O estado selecionado já está aguardando aprovação");
    } else {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.item = this.removerMascaras(this.form.value);
      this.item.situacaoFaturamentoOld = this.contratoCatalogoFaturamento.situacao;

      this.contratoCatalogoService.aprovacaoFaturamentoContratoFornecedor(this.item, false)
        .subscribe(
          (response) => {
            if (response) {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
              this.activeModal.close(true);
            }
          },
          (error) => {
            if (error) {
              this.errorService.treatError(error);
              this.blockUI.stop();
            }
          }
        );
    }
  }

  private editeAprovacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.item = this.removerMascaras(this.form.value);
    this.item.idAprovacaoContratoCatalogoFaturamentoFornecedor = this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.idAprovacaoContratoCatalogoFaturamentoFornecedor;

    this.contratoCatalogoService.aprovacaoFaturamentoContratoFornecedor(this.item, true)
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.activeModal.close(true);
          }
        },
        (error) => {
          if (error) {
            this.errorService.treatError(error);
            this.blockUI.stop();
          }
        }
      );
  }

  private removerMascaras(item: any): AprovacaoContratoCatalogoFaturamentoFornecedor {
    item.valorMinimoPedido = +item.valorMinimoPedido.replace(/\./g, '').replace(',', '.');

    return item;
  }
  //#endregion
}
