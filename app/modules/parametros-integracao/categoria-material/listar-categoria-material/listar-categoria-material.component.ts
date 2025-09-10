import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { CategoriaMaterial } from '@shared/models';
import { CategoriaMaterialService, TranslationLibraryService } from '@shared/providers';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CategoriaMaterialFiltro } from '../../../../shared/models/fltros/categoria-material-filtro';
import { ManterCategoriaMaterialComponent } from '../manter-categoria-material/manter-categoria-material.component';

@Component({
  selector: 'listar-categoria-material',
  templateUrl: './listar-categoria-material.component.html',
  styleUrls: ['./listar-categoria-material.component.scss'],
})
export class ListarCategoriaMaterialComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  categoriasMateriais: Array<CategoriaMaterial> = new Array<CategoriaMaterial>();
  categoriaMaterialFiltro: CategoriaMaterialFiltro = new CategoriaMaterialFiltro();
  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdCategoriaMaterial';
  private termo: string = '';
  private itensPorPagina: number = 16;

  constructor(
    private categoriaMaterialService: CategoriaMaterialService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.ResetPagination();
    this.obterOrigensMateriais();
  }

  ResetPagination() {
    this.categoriasMateriais = new Array<CategoriaMaterial>();
    this.pagina = 1;
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterOrigensMateriais(this.termo);
  }

  onScroll(termo?: string) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterOrigensMateriais();
    }
  }

  buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.obterOrigensMateriais(termo);
  }

  limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.obterOrigensMateriais();
  }

  onEditarClick(categoriaMaterial: CategoriaMaterial) {
    const modalRef = this.modalService.open(ManterCategoriaMaterialComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.componentInstance.categoriaMaterial = categoriaMaterial;
    modalRef.result.then((result) => {
      if (result) {
        this.ResetPagination();
        this.obterOrigensMateriais();
      }
    });
  }

  inserir() {
    const modalRef = this.modalService.open(ManterCategoriaMaterialComponent, {
      centered: true,
      size: 'lg',
    });
    modalRef.result.then((result) => {
      if (result) {
        this.ResetPagination();
        this.obterOrigensMateriais();
      }
    });
  }

  onAuditoriaClick(idCategoriaMaterial: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'CategoriaMaterial';
    modalRef.componentInstance.idEntidade = idCategoriaMaterial;
  }

  onExcluirClick(idCategoriaMaterial: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.removerCategoriaMaterial(idCategoriaMaterial),
        (reason) => { },
      );
  }

  removerCategoriaMaterial(idCategoriaMaterial: number): any {
    this.blockUI.start();
    this.categoriaMaterialService.excluir(idCategoriaMaterial).subscribe(
      (response) => {
        if (response) {
          this.ResetPagination();
          this.Hydrate('');
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
      (responseError) => {
        this.blockUI.stop();
        if (responseError.status === 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      },
    );
  }

  private obterOrigensMateriais(termo: string = '') {

    this.categoriaMaterialFiltro.itensPorPagina = this.itensPorPagina;
    this.categoriaMaterialFiltro.pagina = this.pagina;
    this.categoriaMaterialFiltro.termo = this.termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaMaterialService.filtrar(this.categoriaMaterialFiltro).subscribe(
      (response) => {
        if (response) {
          this.categoriasMateriais = this.categoriasMateriais.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.categoriasMateriais = new Array<CategoriaMaterial>();
          this.totalPaginas = 1;
          this.totalResultados = 0;
        }
        this.blockUI.stop();
      },
      (responseError) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
