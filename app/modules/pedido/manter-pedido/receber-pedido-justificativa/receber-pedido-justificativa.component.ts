import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-receber-pedido-justificativa',
  templateUrl: './receber-pedido-justificativa.component.html',
  styleUrls: ['./receber-pedido-justificativa.component.scss']
})
export class ReceberPedidoJustificativaComponent implements OnInit {
  public justificativa: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public confirmar() {
    this.activeModal.close(
      this.justificativa ? this.justificativa : 'PADRÃO: CANCELAMENTO RECEBIMENTO'
    );
  }

  public cancelar() {
    this.activeModal.close(false);
  }
}
