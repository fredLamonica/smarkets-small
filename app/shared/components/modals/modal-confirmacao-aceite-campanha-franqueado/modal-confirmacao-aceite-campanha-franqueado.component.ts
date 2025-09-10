import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-confirmacao-aceite-campanha-franqueado',
  templateUrl: './modal-confirmacao-aceite-campanha-franqueado.component.html',
  styleUrls: ['./modal-confirmacao-aceite-campanha-franqueado.component.scss']
})
export class ModalConfirmacaoAceiteCampanhaFranqueadoComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public confirm() {
    this.activeModal.close(true);
  }

}
