import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'app-confirmacao',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './confirmacao.component.html',
  styleUrls: ['./confirmacao.component.scss'],
})
export class ConfirmacaoComponent implements OnInit, OnDestroy {

  @Input() confirmacao: string = 'Tem certeza que deseja realizar essa ação?';
  @Input() titulo: string = 'Atenção!';
  @Input() confirmarLabel: string = 'Confirmar';
  @Input() confirmarBtnClass: string = 'btn-primary';
  @Input() cancelarLabel: string = 'Cancelar';
  @Input() cancelarBtnClass: string = 'btn-outline-danger';
  @Input() html: boolean = false;
  @Input() opcionalLabel: string;
  locationSubscription: SubscriptionLike;

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
  ) { }

  ngOnInit() {
    this.locationSubscription = this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }

  confirmar() {
    this.activeModal.close(true);
  }

  cancelar() {
    this.activeModal.close(false);
  }

  botaoOpcional() {
    this.activeModal.close('nao');
  }

}
