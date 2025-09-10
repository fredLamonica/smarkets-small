import { CurrencyPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratoCatalogoEstado } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { SituacaoContratoCatalogoItem } from '../../../../shared/models';
import { TranslationLibraryService } from '../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { RecusaReajusteEstadoComponent } from './recusa-reajuste-estado/recusa-reajuste-estado.component';

type NewType = ContratoCatalogoEstado;

@Component({
  selector: 'smk-reajuste-estados-contrato',
  templateUrl: './reajuste-estados-contrato.component.html',
  styleUrls: ['./reajuste-estados-contrato.component.scss'],
})
export class ReajusteEstadosContratoComponent extends Unsubscriber implements OnInit {

  @Input() idContratoCatalogoEstado: number;

  @BlockUI() blockUI: NgBlockUI;

  form: FormGroup;
  contratoCatalogoEstado: ContratoCatalogoEstado;

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
    this.obterItem()
  }

  cancelar() {
    this.activeModal.close();
  }
  aprove() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    /*this.contratoService.analiseAprovacaoEstado(AnaliseAprovacaoCatalogo.aprovado, this.contratoCatalogoEstado).pipe(
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
      )*/
  }

  recuse() {
    const modalMotivoRecusa = this.modalService.open(RecusaReajusteEstadoComponent, {
      centered: true,
      size: 'lg',
    });

    modalMotivoRecusa.componentInstance.idContratoCatalogoEstado = this.idContratoCatalogoEstado;
    modalMotivoRecusa.componentInstance.contratoCatalogoEstado = this.contratoCatalogoEstado;

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
    return this.contratoCatalogoEstado
           && this.contratoCatalogoEstado.aprovacaoContratoCatalogoEstado
           && this.contratoCatalogoEstado.valorMinimoPedido === this.contratoCatalogoEstado.aprovacaoContratoCatalogoEstado.valorMinimoPedido ? true : false;
  }

  getPrazoEntrega() {
    return this.contratoCatalogoEstado
           && this.contratoCatalogoEstado.aprovacaoContratoCatalogoEstado
           && this.contratoCatalogoEstado.prazoEntregaDias === this.contratoCatalogoEstado.aprovacaoContratoCatalogoEstado.prazoEntrega ? true : false;
  }

  getSituacao() {
    return this.contratoCatalogoEstado
           && this.contratoCatalogoEstado.aprovacaoContratoCatalogoEstado
           && this.contratoCatalogoEstado.situacao === this.contratoCatalogoEstado.aprovacaoContratoCatalogoEstado.situacaoEstado ? true : false;
  }

  private obterItem() {
    this.contratoService.obtenhaEstadoContratoPorId(this.idContratoCatalogoEstado)
      .subscribe((result) => {
        if (result) {
          this.contratoCatalogoEstado = result;
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

  private configureForm(result: ContratoCatalogoEstado) {
    this.form.patchValue({
      nomeEstado: result.estado.nome,
      valorMinimoPedido: this.currencyPipe.transform(result.valorMinimoPedido, undefined, '', '1.2-4', 'pt-BR').trim(),
      PrazoEntrega: result.prazoEntregaDias,
      uf: result.estado.abreviacao,
      situacaoEstado: result.situacao,
      idContratoCatalogoEstado: result.idContratoCatalogoEstado
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
