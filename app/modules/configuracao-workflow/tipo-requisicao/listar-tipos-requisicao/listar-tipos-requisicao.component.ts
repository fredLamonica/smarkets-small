import { Component, OnInit } from '@angular/core';
import { TipoRequisicaoService } from '@shared/providers/tipo-requisicao.service';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoRequisicao } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { ManterTipoRequisicaoComponent } from '../manter-tipo-requisicao/manter-tipo-requisicao.component';

@Component({
  selector: 'listar-tipos-requisicao',
  templateUrl: './listar-tipos-requisicao.component.html',
  styleUrls: ['./listar-tipos-requisicao.component.scss']
})
export class ListarTiposRequisicaoComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdTipoRequisicao';
  private termo: string = '';

  public tiposRequisicao: Array<TipoRequisicao> = new Array<TipoRequisicao>();

  constructor(
    private tipoRequisicaoService: TipoRequisicaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterTipos();
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

  public ResetPagination() {
    this.tiposRequisicao = new Array<TipoRequisicao>();
    this.pagina = 1;
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
    this.tipoRequisicaoService.filtrar(8, this.pagina, this.itemOrdenacao, this.termo).subscribe(
      response => {
        if (response) {
          this.tiposRequisicao = this.tiposRequisicao.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.tiposRequisicao = new Array<TipoRequisicao>();
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
    const modalRef = this.modalService.open(ManterTipoRequisicaoComponent, {
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

  public editarItem(tipoRequisicao: TipoRequisicao) {
    const modalRef = this.modalService.open(ManterTipoRequisicaoComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.tipoRequisicao = tipoRequisicao;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterTipos();
      }
    });
  }

  public onAuditoriaClick(idTipoRequisicao: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'TipoRequisicao';
    modalRef.componentInstance.idEntidade = idTipoRequisicao;
  }

  public onExcluirClick(idTipoRequisicao: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerTipo(idTipoRequisicao),
        reason => {}
      );
  }

  private removerTipo(idTipoRequisicao: number) {
    this.blockUI.start();
    this.tipoRequisicaoService.excluir(idTipoRequisicao).subscribe(
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
