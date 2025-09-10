import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionLike } from 'rxjs';
import { ResultadoValidacaoDeConta } from '../../smk-validacao-de-conta/models/resultado-validacao-de-conta.enum';
import { TipoValidacaoDeConta } from '../../smk-validacao-de-conta/models/tipo-validacao-de-conta.enum';

@Component({
  selector: 'smk-modal-validacao-de-conta',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './smk-modal-validacao-de-conta.component.html',
  styleUrls: ['./smk-modal-validacao-de-conta.component.scss'],
})
export class SmkModalValidacaoDeContaComponent implements OnInit {

  locationSubscription: SubscriptionLike;
  tipo: TipoValidacaoDeConta;
  novoEmail: string = '';

  constructor(private activeModal: NgbActiveModal, private location: Location) { }

  ngOnInit() {
    this.locationSubscription = this.location.subscribe(() => this.activeModal.dismiss(ResultadoValidacaoDeConta.processoCancelado));
  }

  contaValidada(resultado: ResultadoValidacaoDeConta): void {
    if (resultado === ResultadoValidacaoDeConta.contaValidada) {
      this.activeModal.close(resultado);
    } else {
      this.activeModal.dismiss(resultado);
    }
  }

  cancelar() {
    this.activeModal.dismiss(ResultadoValidacaoDeConta.processoCancelado);
  }

  fechar() {
    this.activeModal.dismiss(ResultadoValidacaoDeConta.processoCancelado);
  }

}
