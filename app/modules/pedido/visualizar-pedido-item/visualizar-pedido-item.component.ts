import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Endereco, PedidoItem } from '@shared/models';
import { EnderecoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { UtilitiesService } from '../../../shared/utils/utilities.service';

@Component({
  selector: 'visualizar-pedido-item',
  templateUrl: './visualizar-pedido-item.component.html',
  styleUrls: ['./visualizar-pedido-item.component.scss'],
})
export class VisualizarPedidoItemComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('pedido-item') pedidoItem: PedidoItem;
  endereco: Endereco;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private enderecoService: EnderecoService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private utilitiesService: UtilitiesService,
  ) { }

  ngOnInit() {
    this.obterEndereco();
  }

  fechar() {
    this.activeModal.close();
  }

  obtenhaDataDeEntrega(): string {
    return this.utilitiesService.obtenhaDataDeEntrega(this.pedidoItem);
  }

  private obterEndereco() {
    this.blockUI.start();
    this.enderecoService.obterPorId(this.pedidoItem.idEnderecoEntrega).subscribe((response) => {
      if (response) {
        this.endereco = response;
      } else {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.activeModal.close();
      }
      this.blockUI.stop();
    }, (error) => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
      this.activeModal.close();
    });
  }
}
