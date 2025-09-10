import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmar-encerrar-cotacao',
  templateUrl: './confirmar-encerrar-cotacao.component.html',
  styleUrls: ['./confirmar-encerrar-cotacao.component.scss']
})
export class ConfirmarEncerrarCotacaoComponent implements OnInit {
  public motivoEncerramentoAntecipado: string = '';

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {}

  public cancelar() {
    this.activeModal.close(false);
  }

  public confirmar() {
    if (!this.isEmpty(this.motivoEncerramentoAntecipado)) {
      this.activeModal.close(this.motivoEncerramentoAntecipado);
    }
  }

  public isEmpty(entrada: string) {
    return !entrada || 0 === entrada.length || entrada.match(/^ *$/) !== null;
  }
}
