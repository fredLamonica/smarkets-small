import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ContratoCatalogoItem, Moeda, SituacaoContratoCatalogoItem, TipoFrete } from '../../../shared/models';
import { AprovacaoContratoCatalogoItemFornecedor } from '../../../shared/models/contrato-catalogo/aprovacao-contrato-catalogo-item-fornecedor';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { TranslationLibraryService } from '../../../shared/providers';
import { Garantia } from './../../../shared/models/enums/garantia';
import { ContratoCatalogoService } from './../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from './../../../shared/utils/error.service';

@Component({
  selector: 'smk-edite-produtos-catalogo',
  templateUrl: './edite-produtos-catalogo.component.html',
  styleUrls: ['./edite-produtos-catalogo.component.scss']
})
export class EditeProdutosCatalogoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  idContratoCatalogoItem: number;
  form: FormGroup;
  contratoCatalogoItem: ContratoCatalogoItem;
  opcoesSituacaoCatalogoItem: Array<{ index: number, name: string }>;
  tipoFrete = TipoFrete;
  moeda = Moeda;
  garantia = Garantia;
  item: AprovacaoContratoCatalogoItemFornecedor;
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

  private configureSituacao(situacao: SituacaoContratoCatalogoItem) {
    this.opcoesSituacaoCatalogoItem = new EnumToArrayPipe().transform(SituacaoContratoCatalogoItem) as Array<any>;

    if(situacao != SituacaoContratoCatalogoItem['Aguardando Aprovação']){
        let filtro: (itemSituacao: { index: number, name: string }) => boolean;

        filtro = (itemSituacao: { index: number, name: string }) => {
          return itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Aprovação'] &&
                 itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Exclusão'] &&
                 itemSituacao.index != SituacaoContratoCatalogoItem['Aguardando Inclusão'] &&
                 itemSituacao.index != SituacaoContratoCatalogoItem['Em edição'] &&
                 itemSituacao.index != SituacaoContratoCatalogoItem.Aprovado &&
                 itemSituacao.index != SituacaoContratoCatalogoItem.Recusado
        };

        this.opcoesSituacaoCatalogoItem = this.opcoesSituacaoCatalogoItem.filter((situacao) => filtro(situacao));
    }
  }

  private construaForm(){
    this.form = this.fb.group({
      idContratoCatalogoItem:  [null],
      descricao: [null],
      situacaoContratoCatalogoItem: [null],
      valor: [null],
      loteMinimo: [null],
      frete: [null],
      moeda: [null],
      garantia: [null],
    })
  }

  obtenhaPorId(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoCatalogoService.obtenhaItemContratoPorId(this.idContratoCatalogoItem)
    .subscribe((result) => {
        if(result){
          this.contratoCatalogoItem = result;
          this.configureForm(result);
          this.blockUI.stop();
        }
      },
      (error) => {
        if(error){
          this.errorService.treatError(error);
          this.blockUI.stop();
        }
      }
    )
  }

  private configureForm(result: ContratoCatalogoItem) {

    this.form.patchValue({
      idContratoCatalogoItem: result.idContratoCatalogoItem,
      descricao: result.produto.descricao,
      situacaoContratoCatalogoItem: result.situacao,
      valor: this.currencyPipe.transform(result.valor, undefined, '', '1.2-4', 'pt-BR').trim(),
      loteMinimo: result.loteMinimo,
      frete: result.frete,
      moeda: result.moeda,
      garantia: result.garantia,
    });

    this.configureSituacao(result.situacao);

    if(result.aprovacaoContratoCatalogoItem){
        this.form.disable();
    }else{
        this.form.controls.idContratoCatalogoItem.disable();
        this.form.controls.descricao.disable();
    }
  }

  salvar(){
    if(!this.habiliteEdicao)
      this.envieAprovacao();
    else
      this.editeAprovacao();
  }

  private envieAprovacao(){
    if(this.form.controls.situacaoContratoCatalogoItem.value == SituacaoContratoCatalogoItem['Aguardando Aprovação']){
      this.toastr.warning("O item selecionado já está aguardando aprovação")
    }else{
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.form.controls.idContratoCatalogoItem.enable();
      this.item = this.removerMascaras(this.form.value);
      this.item.situacaoItemOld = this.contratoCatalogoItem.situacao;

      this.contratoCatalogoService.aprovacaoItemContratoFornecedor(this.item, false)
      .subscribe(
          (response) => {
            if (response) {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
              this.activeModal.close(true);
            }
          },
          (error) => {
            if(error){
              this.errorService.treatError(error);
              this.blockUI.stop();
            }
          }
        )
    }
  }

  private editeAprovacao(){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.item = this.removerMascaras(this.form.value);
    this.item.idAprovacaoContratoCatalogoItemFornecedor = this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.idAprovacaoContratoCatalogoItemFornecedor

    this.contratoCatalogoService.aprovacaoItemContratoFornecedor(this.item, true)
    .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.activeModal.close(true);
          }
        },
        (error) => {
          if(error){
            this.errorService.treatError(error);
            this.blockUI.stop();
        }
      }
    )
  }

  atualizar(){
    this.habiliteEdicao = true;
    this.form.enable();
    this.form.setValue({
      idContratoCatalogoItem: this.contratoCatalogoItem.idContratoCatalogoItem,
      descricao: this.contratoCatalogoItem.produto.descricao,
      situacaoContratoCatalogoItem: this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoContratoCatalogoItem,
      valor: this.currencyPipe.transform(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.valor, undefined, '', '1.2-4', 'pt-BR').trim(),
      loteMinimo: this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.loteMinimo,
      frete: this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.frete,
      moeda: this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.moeda,
      garantia: this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.garantia,
    });

    this.configureSituacao(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoContratoCatalogoItem);
  }

  get getPermiteAtualizacao(){
    return this.contratoCatalogoItem && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem != undefined ? true : false;
  }

  private removerMascaras(item: any): AprovacaoContratoCatalogoItemFornecedor {
    item.valor = +item.valor.replace(/\./g, '').replace(',', '.');
    return item;
  }

  cancelar(){
    this.activeModal.close();
  }

  //#region GetValores
    formatCurrency(value: number): string {
      return this.currencyPipe.transform(value, undefined, '', '1.2-4', 'pt-BR').trim();
    }

    getTipoFreteNome(frete: number): string {
      return TipoFrete[frete];
    }

    getGarantiaNome(garantia: number): string {
      return Garantia[garantia];
    }

    getSituacaoItemNome(situacao: number): string {
      return SituacaoContratoCatalogoItem[situacao];
    }

    //#region GetDados

      get getValor(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.valor
              ? this.formatCurrency(this.contratoCatalogoItem.valor) : null;
      }

      get getValorAprovacao(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.valor
              ? this.formatCurrency(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.valor) : null;
      }

      get getFrete(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.frete
              ? this.getTipoFreteNome(this.contratoCatalogoItem.frete) : null;
      }

      get getFreteAprovacao(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.frete
              ? this.getTipoFreteNome(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.frete) : null;
      }

      get getLoteMinimo(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.frete
              ? this.contratoCatalogoItem.frete : null;
      }

      get getLoteMinimoAprovacao(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.loteMinimo
              ? this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.loteMinimo : null;
      }

      get getSituacao(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoItemOld
              ? this.getSituacaoItemNome(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoItemOld) : null;
      }

      get getSituacaoAprovacao(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoContratoCatalogoItem
              ? this.getSituacaoItemNome(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoContratoCatalogoItem) : null;
      }

      get getGarantia(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.garantia
              ? this.getGarantiaNome(this.contratoCatalogoItem.garantia) : 'Nenhuma';
      }

      get getGarantiaAprovacao(){
        return this.contratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem
              && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.garantia
              ? this.getGarantiaNome(this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.garantia) : null;
      }

    //#endregion

    get exibeValor(){
      if(this.contratoCatalogoItem && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem == undefined)
        return true;
      if(this.habiliteEdicao)
        return true;

      return this.contratoCatalogoItem && this.contratoCatalogoItem.valor === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.valor ? true : false;
    }

    get exibeFrete(){
      if(this.contratoCatalogoItem && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem == undefined)
        return true;
      if(this.habiliteEdicao)
        return true;

      return this.contratoCatalogoItem && this.contratoCatalogoItem.frete === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.frete ? true : false;
    }

    get exibeGarantia(){
    if(this.contratoCatalogoItem && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem == undefined)
        return true;

      if(this.habiliteEdicao)
        return true;

      return this.contratoCatalogoItem && this.contratoCatalogoItem.garantia === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.garantia ? true : false;
    }

    get exibeLoteMinimo(){
      if(this.contratoCatalogoItem && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem == undefined)
        return true;

      if(this.habiliteEdicao)
        return true;

      return this.contratoCatalogoItem && this.contratoCatalogoItem.loteMinimo === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.loteMinimo ? true : false;
    }

    get exibeSituacao(){
      if(this.contratoCatalogoItem && this.contratoCatalogoItem.aprovacaoContratoCatalogoItem == undefined)
        return true;

      if(this.habiliteEdicao)
        return true;

      return this.contratoCatalogoItem && this.contratoCatalogoItem.situacao === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoContratoCatalogoItem ? true : false;

    }

    //#endregion
}




