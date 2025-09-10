import { Component, OnInit } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TranslationLibraryService } from '@shared/providers';
import { MotivoDesclassificacaoService } from '@shared/providers/motivo-desclassificacao.service';
import { ManterMotivoDesclassificacaoComponent } from '../manter-motivo-desclassificacao/manter-motivo-desclassificacao.component';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { MotivoDesclassificacao } from '@shared/models/cotacao/motivo-desclassificacao';

@Component({
  selector: 'listar-motivo-desclassificacao',
  templateUrl: './listar-motivo-desclassificacao.component.html',
  styleUrls: ['./listar-motivo-desclassificacao.component.scss']
})
export class ListarMotivoDesclassificacaoComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdMotivoDesclassificacao';
  private termo: string = '';

  public mtd: MotivoDesclassificacao = new MotivoDesclassificacao();

  public motivosDesclassificacao: Array<MotivoDesclassificacao> =
    new Array<MotivoDesclassificacao>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private motivoDesclassificacaoService: MotivoDesclassificacaoService
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterMotivosDesclassificacao();
  }

  ResetPagination() {
    this.motivosDesclassificacao = new Array<MotivoDesclassificacao>();
    this.pagina = 1;
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterMotivosDesclassificacao(this.termo);
  }

  onScroll(termo?: string) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterMotivosDesclassificacao();
    }
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterMotivoDesclassificacaoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.result.then(result => {
      if (result) {
        this.motivosDesclassificacao.unshift(result);
      }
    });
  }

  public obterMotivosDesclassificacao(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.motivoDesclassificacaoService.filtrar(8, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.motivosDesclassificacao = this.motivosDesclassificacao.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.motivosDesclassificacao = new Array<MotivoDesclassificacao>();
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

  public editarItem(motivoDesclassificacao: MotivoDesclassificacao) {
    const modalRef = this.modalService.open(ManterMotivoDesclassificacaoComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
    modalRef.componentInstance.motivoDesclassificacao = motivoDesclassificacao;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterMotivosDesclassificacao();
      }
    });
  }

  public onAuditoriaClick(idMotivoDesclassificacao: number) {
    // const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    // modalRef.componentInstance.nomeClasse = 'TipoPedido';
    // modalRef.componentInstance.idEntidade = idTipoPedido;
  }

  public onExcluirClick(idMotivoDesclassificacao: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true, backdrop: 'static' })
      .result.then(
        result => this.removerMotivoDesclassificacao(idMotivoDesclassificacao),
        reason => {}
      );
  }

  private removerMotivoDesclassificacao(idMotivoDesclassificacao: number) {
    this.blockUI.start();
    this.motivoDesclassificacaoService.excluir(idMotivoDesclassificacao).subscribe(
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
