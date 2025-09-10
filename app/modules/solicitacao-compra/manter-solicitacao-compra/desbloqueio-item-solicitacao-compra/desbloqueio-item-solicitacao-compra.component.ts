import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemSolicitacaoCompra } from '@shared/models';
import { SolicitacaoCompraService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'desbloqueio-item-solicitacao-compra',
  templateUrl: './desbloqueio-item-solicitacao-compra.component.html',
  styleUrls: ['./desbloqueio-item-solicitacao-compra.component.scss']
})
export class DesbloqueioItemSolicitacaoCompraComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public itensSolicitacaoCompra = new Array<ItemSolicitacaoCompra>();
  public dataLiberacaoHeader: string;

  constructor(
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private solicitacaoCompraService: SolicitacaoCompraService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.dataLiberacaoHeader = moment().format('YYYY-MM-DD');
    this.ajustaDataItens();
  }

  private ajustaDataItens() {
    this.itensSolicitacaoCompra.forEach(item => {
      item.dataLiberacaoItem = this.date(item.dataLiberacaoItem);
    });
  }

  public confirmaDesbloquear() {
    if (this.itensValidos()) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.solicitacaoCompraService.desbloquearItensSc(this.itensSolicitacaoCompra).subscribe(
        response => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.confirmar();
          } else {
            this.toastr.warning('Falha ao recuperar Solicitação de compra.');
          }
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  private date(date: string) {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  public copiarDataParaItens() {
    this.itensSolicitacaoCompra.forEach(item => {
      item.dataLiberacaoItem = this.dataLiberacaoHeader;
    });
  }

  private itensValidos() {
    if (
      this.itensSolicitacaoCompra.some(
        p => p.dataLiberacaoItem == null || p.dataLiberacaoItem == ''
      )
    ) {
      this.toastr.warning('Preencha corretamente a data de Liberação dos Itens');
      return false;
    }
    return true;
  }

  public confirmar() {
    this.activeModal.close(true);
  }

  public cancelar() {
    this.activeModal.close(false);
  }
}
