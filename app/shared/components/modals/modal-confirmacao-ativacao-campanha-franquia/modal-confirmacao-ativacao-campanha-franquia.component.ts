import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'modal-confirmacao-ativacao-campanha-franquia',
  templateUrl: './modal-confirmacao-ativacao-campanha-franquia.component.html',
  styleUrls: ['./modal-confirmacao-ativacao-campanha-franquia.component.scss']
})
export class ModalConfirmacaoAtivacaoCampanhaFranquiaComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public confirm() {
    this.activeModal.close(true);
  }

}
