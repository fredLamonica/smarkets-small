import { Component, OnInit } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GrupoCompradores } from '@shared/models/grupo-compradores';
import { GrupoCompradoresService } from '@shared/providers/grupo-compradores.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationLibraryService } from '@shared/providers';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { ManterGrupoCompradoresComponent } from '../manter-grupo-compradores/manter-grupo-compradores.component';

@Component({
  selector: 'listar-grupo-compradores',
  templateUrl: './listar-grupo-compradores.component.html',
  styleUrls: ['./listar-grupo-compradores.component.scss']
})
export class ListarGrupoCompradoresComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdGrupoCompradores';
  private termo: string = '';

  public gruposCompradores: Array<GrupoCompradores> = new Array<GrupoCompradores>();

  constructor(
    private grupoCompradoresService: GrupoCompradoresService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterGrupos();
  }

  public ResetPagination() {
    this.gruposCompradores = new Array<GrupoCompradores>();
    this.pagina = 1;
  }

  public buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.obterGrupos(termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.obterGrupos();
  }

  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterGrupos();
    }
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterGrupos(this.termo);
  }

  private obterGrupos(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.grupoCompradoresService.filtrar(8, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.gruposCompradores = this.gruposCompradores.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.gruposCompradores = new Array<GrupoCompradores>();
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
    const modalRef = this.modalService.open(ManterGrupoCompradoresComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterGrupos();
      }
    });
  }

  public editarItem(grupoCompradores: GrupoCompradores) {
    const modalRef = this.modalService.open(ManterGrupoCompradoresComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.grupoCompradores = grupoCompradores;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterGrupos();
      }
    });
  }

  public onAuditoriaClick(idGrupoCompradores: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'GrupoCompradores';
    modalRef.componentInstance.idEntidade = idGrupoCompradores;
  }

  public onExcluirClick(idGrupoCompradores: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerGrupo(idGrupoCompradores),
        reason => {}
      );
  }

  private removerGrupo(idGrupoCompradores: number) {
    this.blockUI.start();
    this.grupoCompradoresService.excluir(idGrupoCompradores).subscribe(
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
