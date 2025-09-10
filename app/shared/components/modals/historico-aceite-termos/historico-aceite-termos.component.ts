import { Component, OnInit, Input } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { HistoricoDeAceiteDeTermo } from '@shared/models/historico-de-aceite-de-termo';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'app-historico-aceite-termos',
  templateUrl: './historico-aceite-termos.component.html',
  styleUrls: ['./historico-aceite-termos.component.scss']
})
export class HistoricoAceiteTermosComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  @Input() historicoDeAceitesDeTermos: HistoricoDeAceiteDeTermo[];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public formatarData(data: string): string{
    let dataRetorno = moment(data);
    return dataRetorno.format("DD/MM/YYYY HH:mm:ss");
  }

  public obterDescricao(aceitouTermo: boolean){
    if (aceitouTermo)
      return "Leu e aceitou os termos de boas práticas";
    else
      return "Não está de acordo com os termos de boas práticas ao fornecedor";
  }

  public fechar(){
    this.activeModal.close();
  }


}
