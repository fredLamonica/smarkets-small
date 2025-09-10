import { Component, OnInit } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TipoPedido } from '@shared/models/tipo-pedido';
import { TipoPedidoService } from '@shared/providers/tipo-pedido.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationLibraryService } from '@shared/providers';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { ManterTipoPedidoComponent } from '../manter-tipo-pedido/manter-tipo-pedido.component';

@Component({
  selector: 'listar-tipos-pedido',
  templateUrl: './listar-tipos-pedido.component.html',
  styleUrls: ['./listar-tipos-pedido.component.scss']
})
export class ListarTiposPedidoComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdTipoPedido';
  private termo: string = '';

  public tiposPedido: Array<TipoPedido> = new Array<TipoPedido>();

  constructor(
    private tipoPedidoService: TipoPedidoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterTipos();
  }

  public ResetPagination() {
    this.tiposPedido = new Array<TipoPedido>();
    this.pagina = 1;
  }

  public buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.obterTipos(termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.obterTipos();
  }

  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterTipos();
    }
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterTipos(this.termo);
  }

  private obterTipos(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.tipoPedidoService.filtrar(8, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.tiposPedido = this.tiposPedido.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.tiposPedido = new Array<TipoPedido>();
          this.totalPaginas = 1;
          this.totalResultados = 0;
        }
        this.blockUI.stop();
      },
      responseError => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterTipoPedidoComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterTipos();
      }
    });
  }

  public editarItem(tipoPedido: TipoPedido) {
    const modalRef = this.modalService.open(ManterTipoPedidoComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.tipoPedido = tipoPedido;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterTipos();
      }
    });
  }

  public onAuditoriaClick(idTipoPedido: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'TipoPedido';
    modalRef.componentInstance.idEntidade = idTipoPedido;
  }

  public onExcluirClick(idTipoPedido: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerTipo(idTipoPedido),
        reason => {}
      );
  }

  private removerTipo(idTipoPedido: number) {
    this.blockUI.start();
    this.tipoPedidoService.excluir(idTipoPedido).subscribe(
      response => {
        if (response) {
          this.ResetPagination();
          this.Hydrate('');
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }
}
