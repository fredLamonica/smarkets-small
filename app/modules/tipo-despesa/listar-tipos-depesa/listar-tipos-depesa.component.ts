import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { TranslationLibraryService, TipoDespesaService } from '@shared/providers';
import { CustomTableSettings, CustomTableColumn, CustomTableColumnType, TipoDespesa } from '@shared/models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'app-listar-tipos-depesa',
  templateUrl: './listar-tipos-depesa.component.html',
  styleUrls: ['./listar-tipos-depesa.component.scss']
})
export class ListarTiposDepesaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public tipos: Array<TipoDespesa>;

  public settings: CustomTableSettings;
  public selecionados: Array<TipoDespesa>;

  public registrosPorPagina: number = 5;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private tipoService: TipoDespesaService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.obterTipos();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("#", "idTipoDespesa", CustomTableColumnType.text, null, null),
        new CustomTableColumn("Código", "codigo", CustomTableColumnType.text, null, null),
        new CustomTableColumn("Descrição", "descricao", CustomTableColumnType.text, null, null)
      ], "check"
    );
  }

  private obterTipos(termo: string = "") {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.tipoService.filtrar(this.registrosPorPagina, this.pagina, termo).subscribe(
      response => {
        if(response) {
          this.tipos = response.itens;
          this.totalPaginas = response.numeroPaginas
        } else {
          this.tipos = new Array<TipoDespesa>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public selecao(tipos: Array<TipoDespesa>) {
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
    this.tipoService.excluir(this.selecionados[0].idTipoDespesa).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.pagina = 1;
      this.obterTipos();
    }, error => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }

  public paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterTipos("");
  }

}
