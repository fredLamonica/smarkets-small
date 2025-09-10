import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-confirmacao-recusa-campanha-franqueado',
  templateUrl: './modal-confirmacao-recusa-campanha-franqueado.component.html',
  styleUrls: ['./modal-confirmacao-recusa-campanha-franqueado.component.scss']
})
export class ModalConfirmacaoRecusaCampanhaFranqueadoComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public confirm() {
    this.activeModal.close(true);
  }

}
