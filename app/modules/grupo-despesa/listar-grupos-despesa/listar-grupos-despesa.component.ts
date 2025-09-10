import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { TranslationLibraryService, GrupoDespesaService } from '@shared/providers';
import { CustomTableSettings, CustomTableColumn, CustomTableColumnType, GrupoDespesa } from '@shared/models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'app-listar-grupos-despesa',
  templateUrl: './listar-grupos-despesa.component.html',
  styleUrls: ['./listar-grupos-despesa.component.scss']
})
export class ListarGruposDespesaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public grupos: Array<GrupoDespesa>;

  public settings: CustomTableSettings;

  public selecionados: Array<GrupoDespesa>;
  
  public registrosPorPagina: number = 5;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private grupoService: GrupoDespesaService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.obterGrupos();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("#", "idGrupoDespesa", CustomTableColumnType.text, null, null),
        new CustomTableColumn("Código", "codigo", CustomTableColumnType.text, null, null),
        new CustomTableColumn("Descrição", "descricao", CustomTableColumnType.text, null, null)
      ], "check"
    );
  }

  private obterGrupos(termo: string = "") {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.grupoService.filtrar(this.registrosPorPagina, this.pagina, termo).subscribe(
      response => {
        if(response) {
          this.grupos = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.grupos = new Array<GrupoDespesa>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public selecao(tipos: Array<GrupoDespesa>) {
    this.selecionados = tipos;
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(), 
      reason => {}
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.grupoService.excluir(this.selecionados[0].idGrupoDespesa).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.pagina = 1;
      this.obterGrupos();
    }, error => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }

  public paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterGrupos();
  }
}
