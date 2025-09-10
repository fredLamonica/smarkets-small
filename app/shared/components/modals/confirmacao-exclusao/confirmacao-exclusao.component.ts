import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionLike } from 'rxjs';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'modal-confirmacao-exclusao',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './confirmacao-exclusao.component.html',
})
// tslint:disable-next-line: component-class-suffix
export class ModalConfirmacaoExclusao implements OnInit, OnDestroy {
  @Input() name;
  locationSubscription: SubscriptionLike;

  constructor(
    public activeModal: NgbActiveModal,
    private location: Location,
  ) { }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.locationSubscription = this.location.subscribe(() => this.activeModal.dismiss());
  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
  }
}
