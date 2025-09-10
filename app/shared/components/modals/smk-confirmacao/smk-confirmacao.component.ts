import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionLike } from 'rxjs';
import { TemaBotoesModalConfirmacao } from './enums/tema-botoes-modal-confirmacao.enum';
import { TemaIconeModalConfirmacao } from './enums/tema-icone-modal-confirmacao.enum';

@Component({
  selector: 'smk-confirmacao',
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }],
  templateUrl: './smk-confirmacao.component.html',
  styleUrls: ['./smk-confirmacao.component.scss'],
})
export class SmkConfirmacaoComponent implements OnInit, OnDestroy {

  conteudo: string = 'Tem certeza que deseja realizar essa ação?';
  mensagemAdicional: string;
  titulo: string = 'Confirmar ação';
  labelBotaoConfirmar: string = 'Confirmar';
  temaBotaoConfirmar: TemaBotoesModalConfirmacao = TemaBotoesModalConfirmacao.azul;
  labelBotaoCancelar: string = 'Cancelar';
  temaBotaoCancelar: TemaBotoesModalConfirmacao = TemaBotoesModalConfirmacao.azul;
  btnCancelarTema: string = 'Confirmar';
  html: boolean;
  classIcone: string;
  temaIcone: TemaIconeModalConfirmacao = TemaIconeModalConfirmacao.azul;

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
    this.activeModal.dismiss();
  }

  fechar() {
    this.activeModal.dismiss();
  }

}
