import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { SituacaoContratoCatalogoItem } from '../../../../shared/models';
import { ContratoCatalogoFaturamento } from '../../../../shared/models/contrato-catalogo/contrato-catalogo-faturamento';
import { AnaliseAprovacaoCatalogo } from '../../../../shared/models/enums/analise-aprovacao-catalogo';
import { TranslationLibraryService } from '../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { RecusaReajusteFaturamentoComponent } from '../recusa-reajuste-faturamento/recusa-reajuste-faturamento.component';

@Component({
  selector: 'smk-reajuste-faturamento-contrato-catalogo',
  templateUrl: './reajuste-faturamento-contrato-catalogo.component.html',
  styleUrls: ['./reajuste-faturamento-contrato-catalogo.component.scss']
})
export class ReajusteFaturamentoContratoCatalogoComponent extends Unsubscriber implements OnInit {

 @Input() idContratoCatalogoFaturamento: number;

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  contratoCatalogoFaturamento: ContratoCatalogoFaturamento;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private currencyPipe: CurrencyPipe,
    private contratoService: ContratoCatalogoService,
    private errorService: ErrorService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    this.obterFaturamento()
  }

  cancelar() {
    this.activeModal.close();
  }
  aprove() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let contratos = new Array<ContratoCatalogoFaturamento>() ;
    contratos.push(this.contratoCatalogoFaturamento);

    this.contratoService.analiseAprovacaoFaturamento(AnaliseAprovacaoCatalogo.aprovado, contratos).pipe(
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
    const modalMotivoRecusa = this.modalService.open(RecusaReajusteFaturamentoComponent, {
      centered: true,
      size: 'lg',
    });

    modalMotivoRecusa.componentInstance.idContratoCatalogoFaturamento = this.idContratoCatalogoFaturamento;
    modalMotivoRecusa.componentInstance.contratoCatalogoFaturamento = this.contratoCatalogoFaturamento;

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

  getSituacaoEstadoNome(situacao: number): string {
    return SituacaoContratoCatalogoItem[situacao];
  }

  getValorMinimo() {
    return this.contratoCatalogoFaturamento
           && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento
           && this.contratoCatalogoFaturamento.valorMinimoPedido === this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.valorMinimoPedido ? true : false;
  }

  getSituacao() {
    return this.contratoCatalogoFaturamento
           && this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento
           && this.contratoCatalogoFaturamento.situacao === this.contratoCatalogoFaturamento.aprovacaoContratoCatalogoFaturamento.situacaoFaturamento ? true : false;
  }

  private obterFaturamento() {
    this.contratoService.obtenhaFaturamentoContratoPorId(this.idContratoCatalogoFaturamento)
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

  private configureForm(result: ContratoCatalogoFaturamento) {
    this.form.patchValue({
      nomeEstado: result.estado.nome,
      valorMinimoPedido: this.currencyPipe.transform(result.valorMinimoPedido, undefined, '', '1.2-4', 'pt-BR').trim(),
      uf: result.estado.abreviacao,
      situacaoEstado: result.situacao,
      idContratoCatalogoFaturamento: result.idContratoCatalogoFaturamento
    });
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      nomeEstado: [null],
      valorMinimoPedido: [null],
      PrazoEntrega: [null],
      uf: [null],
      situacaoEstado: [null],
      idContratoCatalogoEstado: [null]
    });

    this.form.disable();
  }

}
