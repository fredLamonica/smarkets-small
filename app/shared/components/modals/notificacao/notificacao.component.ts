import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-notificacao',
  templateUrl: './notificacao.component.html',
  styleUrls: ['./notificacao.component.scss']
})
export class NotificacaoComponent implements OnInit {

  @Input() mensagelLabel: string = "Ok"
  @Input() icone: string = "far fa-thumbs-up"
  @Input() timeout: number = 500


  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() { 
    setTimeout(() => {
      this.activeModal.dismiss();
    }, this.timeout);
  }
 
  public cancelar() {
    this.activeModal.dismiss();
  }
}
