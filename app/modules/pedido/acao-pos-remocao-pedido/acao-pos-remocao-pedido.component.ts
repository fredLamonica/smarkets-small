import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-acao-pos-remocao-pedido',
  templateUrl: './acao-pos-remocao-pedido.component.html',
  styleUrls: ['./acao-pos-remocao-pedido.component.scss']
})
export class AcaoPosRemocaoPedidoComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public somenteRemover() {
    this.activeModal.close("somenteRemover");
  }

  public novoItem() {
    this.activeModal.close("novoItem");
  }

  public novoFornecedor() {
    this.activeModal.close("novoFornecedor");
  }

  public cancelar() {
    this.activeModal.close();
  }

}
