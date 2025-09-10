import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Endereco, Moeda, Ordenacao, RequisicaoItem, SituacaoRequisicaoItem, TipoEndereco, TipoRequisicao, UnidadeMedidaTempo } from '@shared/models';
import { LocalStorageService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { RequisicaoService } from '../../../shared/providers/requisicao.service';
import { Acompanhamento } from '../acompanhamento';
import { RequisicaoFiltro } from './../../../shared/models/fltros/requisicao-filtro';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'acompanhamento-requisicao',
  templateUrl: './acompanhamento-requisicao.component.html',
  styleUrls: ['./acompanhamento-requisicao.component.scss'],
})
export class AcompanhamentoRequisicaoComponent extends Unsubscriber implements OnInit, Acompanhamento {
  @BlockUI() blockUI: NgBlockUI;

  Moeda = Moeda;
  TipoEndereco = TipoEndereco;
  SituacaoRequisicaoItem = SituacaoRequisicaoItem;
  TipoRequisicao = TipoRequisicao;
  UnidadeMedidaTempo = UnidadeMedidaTempo;

  requisicaoItens: Array<RequisicaoItem>;
  enderecos: Array<Endereco>;
  timeline: Array<any>;

  private totalPaginas: number;
  private pagina: number;
  private itemOrdenacao: string = 'IsFavorita DESC, r.DataCriacao';

  private filtroRequisicao = 'filtroRequisicao';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private requisicaoService: RequisicaoService,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
  ) {
    super();
  }

  ngOnInit() {
    this.resetPaginacao();

    const filtroRequisicao = this.localStorageService.getObject(this.filtroRequisicao);
    if (filtroRequisicao) {
      this.obterFiltroAvancado(null, filtroRequisicao);
    } else {
      this.obter();
    }
  }

  resetPaginacao() {
    this.requisicaoItens = new Array<RequisicaoItem>();
    this.pagina = 1;
  }

  onScroll(termo: string = '', parametrosFiltroAvancado: any[] = null) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      if (parametrosFiltroAvancado != null) {
        this.obterFiltroAvancado(parametrosFiltroAvancado);
      } else { this.obter(termo); }
    }
  }

  obterFiltroAvancado(parametrosFiltroAvancado: any[], objetoFiltro?: RequisicaoFiltro) {
    const idRequisicao = objetoFiltro ? objetoFiltro.idRequisicao : parametrosFiltroAvancado[0];
    const termoCodigoRCRequisicao = objetoFiltro
      ? objetoFiltro.termoCodigoRCRequisicao
      : parametrosFiltroAvancado[1];
    const termoCategoriaRequisicao = objetoFiltro
      ? objetoFiltro.termoCategoriaRequisicao
      : parametrosFiltroAvancado[2];
    const termoEmailRequisitante = objetoFiltro
      ? objetoFiltro.termoEmailRequisitante
      : parametrosFiltroAvancado[3];
    const termoResponsavelRequisicao = objetoFiltro
      ? objetoFiltro.termoResponsavelRequisicao
      : parametrosFiltroAvancado[4];
    const termoStatusRequisicao = objetoFiltro
      ? objetoFiltro.termoStatusRequisicao
      : parametrosFiltroAvancado[5];
    const termoSituacaoSolicitacao = objetoFiltro
      ? objetoFiltro.termoSituacaoSolicitacao
      : parametrosFiltroAvancado[6];
    const termoCategoriaDemanda = objetoFiltro
      ? objetoFiltro.termoCategoriaDemanda
      : parametrosFiltroAvancado[7];
    const termoCodigoFilialEmpresa = objetoFiltro
      ? objetoFiltro.termoCodigoFilialEmpresa
      : parametrosFiltroAvancado[8];
    const tipoDocumento = objetoFiltro
      ? objetoFiltro.tipoDocumento
      : parametrosFiltroAvancado[9];
    const idRequisicaoErp = objetoFiltro
      ? objetoFiltro.idRequisicaoErp
      : parametrosFiltroAvancado[10];
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.requisicaoService
      .obterFiltroAvancado(
        'r.IdRequisicao',
        Ordenacao.DESC,
        16,
        this.pagina,
        idRequisicao,
        termoCodigoRCRequisicao,
        termoCategoriaRequisicao,
        termoEmailRequisitante,
        termoResponsavelRequisicao,
        termoStatusRequisicao,
        termoSituacaoSolicitacao,
        termoCategoriaDemanda,
        termoCodigoFilialEmpresa,
        tipoDocumento,
        idRequisicaoErp,
      )
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.requisicaoItens = this.requisicaoItens.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.requisicaoItens = new Array<RequisicaoItem>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  obter(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.requisicaoService
      .filtrarRequisicaoItens(16, this.pagina, this.itemOrdenacao, termo)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.requisicaoItens = this.requisicaoItens.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.requisicaoItens = new Array<RequisicaoItem>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }
}
