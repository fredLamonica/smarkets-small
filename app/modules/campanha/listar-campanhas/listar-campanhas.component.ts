import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { Campanha, Ordenacao, SituacaoCampanha } from '@shared/models';
import { CampanhaService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CampanhaFiltro } from '../../../shared/models/fltros/campanha-filtro';

@Component({
  selector: 'app-listar-campanhas',
  templateUrl: './listar-campanhas.component.html',
  styleUrls: ['./listar-campanhas.component.scss'],
})
export class ListarCampanhasComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  SituacaoCampanha = SituacaoCampanha;

  campanhas: Array<Campanha>;
  registrosPorPagina: number = 24;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idCampanha';
  ordenacao: Ordenacao = Ordenacao.DESC;
  campanhaFiltro: CampanhaFiltro = new CampanhaFiltro();

  private termo: string = '';

  constructor(
    private translationLibrary: TranslationLibraryService,
    private campanhaService: CampanhaService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.resetPaginacao();
    this.obterCampanhas();
  }

  buscar(termo: string) {
    this.termo = termo;
    this.resetPaginacao();
    this.obterCampanhas();
  }

  onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterCampanhas();
    }
  }

  resetPaginacao() {
    this.campanhas = new Array<Campanha>();
    this.pagina = 1;
  }

  // #region Ações

  solicitarExclusao(idCampanha: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(idCampanha),
      (reason) => { },
    );
  }

  auditar(idCampanha: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'Campanha';
    modalRef.componentInstance.idEntidade = idCampanha;
  }

  private obterCampanhas() {

    this.campanhaFiltro.itensPorPagina = this.registrosPorPagina;
    this.campanhaFiltro.pagina = this.pagina;
    this.campanhaFiltro.itemOrdenar = this.ordenarPor;
    this.campanhaFiltro.ordenacao = this.ordenacao;
    this.campanhaFiltro.termo = this.termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.campanhaService.filtrar(this.campanhaFiltro).subscribe(
      (response) => {
        if (response) {
          this.campanhas = this.campanhas.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.campanhas = new Array<Campanha>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private excluir(idCampanha: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.campanhaService.excluir(idCampanha).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.resetPaginacao();
        this.obterCampanhas();
      }, (error) => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      },
    );
  }

  // #endregion

}
