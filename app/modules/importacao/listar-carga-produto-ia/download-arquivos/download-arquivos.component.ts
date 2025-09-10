import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionLike } from 'rxjs';

@Component({
  selector: 'smk-download-arquivos',
  templateUrl: './download-arquivos.component.html',
  styleUrls: ['./download-arquivos.component.scss']
})
export class DownloadArquivosComponent  implements OnInit, OnDestroy  {

  @Input() confirmacao: string ='Escolha qual download de arquivo deseja';
  @Input() titulo: string = 'Atenção!';
  @Input() confirmarLabel: string = 'Confirmar';
  @Input() confirmarBtnClass: string = 'btn-primary';
  @Input() cancelarLabel: string = 'Cancelar';
  @Input() cancelarBtnClass: string = 'btn-outline-danger';
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

  ArquivoImportacao() {
    this.activeModal.close('Importacao');
  }

  ArquivoDownload() {
    this.activeModal.close('Download');
  }

  cancelar() {
    this.activeModal.close(false);
  }

}
