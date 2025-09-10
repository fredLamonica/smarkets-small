import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataHistoricoRecebimentoDto, SituacaoPedido } from '@shared/models';
import { TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from '../../../shared/providers/pedido.service';

@Component({
  selector: 'app-listar-historico-recebimento-pedido',
  templateUrl: './listar-historico-recebimento-pedido.component.html',
  styleUrls: ['./listar-historico-recebimento-pedido.component.scss'],
})
export class ListarHistoricoRecebimentoPedidoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  idPedido: number;
  situacao: SituacaoPedido;
  Situacao = SituacaoPedido;
  historicosRecebimento: Array<DataHistoricoRecebimentoDto>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    public activeModal: NgbActiveModal,
    private pedidoService: PedidoService,
  ) { }

  ngOnInit() {
    this.obterHistoricosRecebimento();
  }

  voltar() {
    this.activeModal.close();
  }

  private obterHistoricosRecebimento() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pedidoService.obterHistoricosRecebimento(this.idPedido).subscribe(
      (response) => {
        if (response) {
          this.historicosRecebimento = response;
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
