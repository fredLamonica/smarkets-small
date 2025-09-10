import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ContratoCatalogoItem, Garantia, Moeda, SituacaoContratoCatalogoItem, TipoFrete } from '../../../../shared/models';
import { TranslationLibraryService } from '../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { AnaliseAprovacaoCatalogo } from './../../../../shared/models/enums/analise-aprovacao-catalogo';
import { RecusaReajusteItemComponent } from './recusa-reajuste-item/recusa-reajuste-item.component';

@Component({
  selector: 'smk-reajuste-item-contrato',
  templateUrl: './reajuste-item-contrato.component.html',
  styleUrls: ['./reajuste-item-contrato.component.scss'],
})
export class ReajusteItemContratoComponent extends Unsubscriber implements OnInit {

  @Input() idContratoCatalogoItem: number;

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  contratoCatalogoItem: ContratoCatalogoItem;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private currencyPipe: CurrencyPipe,
    private contratoService: ContratoCatalogoService,
    private errorService: ErrorService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    this.obterItem()
  }

  cancelar() {
    this.activeModal.close();
  }
  aprove() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoService.analiseAprovacaoItem(AnaliseAprovacaoCatalogo.aprovado, this.contratoCatalogoItem ).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((result) => {
        if (result) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.activeModal.close(true);
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

  recuse() {
    const modalMotivoRecusa = this.modalService.open(RecusaReajusteItemComponent, {
      centered: true,
      size: 'lg',
    });

    modalMotivoRecusa.componentInstance.idContratoCatalogoItem = this.idContratoCatalogoItem;
    modalMotivoRecusa.componentInstance.contratoCatalogoItem = this.contratoCatalogoItem;

    modalMotivoRecusa.result.then(
      (result) => {
        if (result) {
          this.activeModal.close(true);
        }
      },
      (error) => {
        this.errorService.treatError(error);
      }
    );
  }

  formatCurrency(value: number): string {
    return this.currencyPipe.transform(value, undefined, '', '1.2-4', 'pt-BR').trim();
  }

  getTipoFreteNome(valor: number): string {
    return TipoFrete[valor];
  }
  getGarantiaNome(valor: number): string {
    return Garantia[valor];
  }
  getMoedaNome(valor: number): string {
    return Moeda[valor];
  }
  getSituacaoItemNome(valor: number): string {
    return SituacaoContratoCatalogoItem[valor];
  }

  getValor() {
    return this.contratoCatalogoItem.valor === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.valor ? true : false;
  }

  getFrete() {
    return this.contratoCatalogoItem.frete === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.frete ? true : false;
  }

  getGarantia() {
    return this.contratoCatalogoItem.garantia === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.garantia ? true : false;
  }

  getloteMinimo() {
    return this.contratoCatalogoItem.loteMinimo === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.loteMinimo ? true : false;
  }

  getSituacao() {
    return this.contratoCatalogoItem.situacao === this.contratoCatalogoItem.aprovacaoContratoCatalogoItem.situacaoContratoCatalogoItem ? true : false;
  }

  private obterItem() {
    this.contratoService.obtenhaItemContratoPorId(this.idContratoCatalogoItem)
      .subscribe((result) => {
        if (result) {
          this.contratoCatalogoItem = result;
          this.configureForm();
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

  private configureForm() {
    this.form.patchValue({
      idContratoCatalogoItem: this.contratoCatalogoItem.idContratoCatalogoItem,
      descricao: this.contratoCatalogoItem.produto.descricao,
      situacaoContratoCatalogoItem: this.contratoCatalogoItem.situacao,
      valor: this.currencyPipe.transform(this.contratoCatalogoItem.valor, undefined, '', '1.2-4', 'pt-BR').trim(),
      loteMinimo: this.contratoCatalogoItem.loteMinimo,
      frete: this.contratoCatalogoItem.frete,
      moeda: this.contratoCatalogoItem.moeda,
      garantia: this.contratoCatalogoItem.garantia,
    });
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idContratoCatalogoItem: [null],
      descricao: [null],
      valor: [null],
      moeda: [null],
      garantia: [null],
      loteMinimo: [null],
      situacaoContratoCatalogoItem: [null],
    });

    this.form.disable();
  }

}
