import { ItemSolicitacaoCompra, ItemSolicitacaoCompraComentario } from '@shared/models';
import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationLibraryService, AutenticacaoService, SolicitacaoCompraService } from '@shared/providers';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-comentario-modal',
  templateUrl: './item-comentario-modal.component.html',
  styleUrls: ['./item-comentario-modal.component.scss']
})
export class ItemComentarioModalComponent implements OnInit {


  @Input() titulo: string = "Comentário"
  @BlockUI() blockUI: NgBlockUI;

  @Input() item: ItemSolicitacaoCompra;

  constructor(
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private solicitacaoCompraService: SolicitacaoCompraService
  ) { }

  ngOnInit() {
    this.obterComentarios();
  }

  public fechar() {
    this.activeModal.close();
  }

  // #region Comentarios
  public obterComentarios() {
    if (!this.item.comentarios) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.solicitacaoCompraService.obterComentariosPorItem(this.item.solicitacaoCompra.idSolicitacaoCompra, this.item.idItemSolicitacaoCompra).subscribe(
        response => {
          if (response)
            this.item.comentarios = response;
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  public enviarComentario(comentario: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoCompraService.comentarItem(this.item.solicitacaoCompra.idSolicitacaoCompra, this.item.idItemSolicitacaoCompra, comentario).subscribe(
      response => {
        if (response) {
          if (!this.item.comentarios)
            this.item.comentarios = new Array<ItemSolicitacaoCompraComentario>();
          response.usuarioAutor = this.authService.usuario();
          this.item.comentarios.unshift(response);
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  // #endregion



}
