import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { DomicilioBancario } from '@shared/models';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { TranslationLibraryService, DomicilioBancarioService } from '@shared/providers';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'item-domicilio-bancario',
  templateUrl: './item-domicilio-bancario.component.html',
  styleUrls: ['./item-domicilio-bancario.component.scss']
})
export class ItemDomicilioBancarioComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() domicilio: DomicilioBancario;

  @Output() atualizarDomicilios: EventEmitter<any> = new EventEmitter();
  @Output() itemClickedEvent: EventEmitter<DomicilioBancario> = new EventEmitter();

  public disabled: boolean = false;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private domicilioService: DomicilioBancarioService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {}

  public itemClicked() {
    if (this.itemClickedEvent && !this.disabled) {
      this.itemClickedEvent.emit(this.domicilio);
    }
  }

  public solicitarExclusao() {
    this.disabled = true;
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => {
        this.excluir();
        this.disabled = false;
      },
      reason => {
        this.disabled = false;
      }
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.domicilioService.deletar(this.domicilio.idDomicilioBancario).subscribe(
      resultado => {
        this.atualizarDomicilios.emit();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
