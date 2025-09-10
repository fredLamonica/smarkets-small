import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { NaturezaJuridica, CustomTableSettings, CustomTableColumn, CustomTableColumnType } from '@shared/models';
import { TranslationLibraryService, NaturezaJuridicaService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'app-listar-naturezas-juridicas',
  templateUrl: './listar-naturezas-juridicas.component.html',
  styleUrls: ['./listar-naturezas-juridicas.component.scss']
})
export class ListarNaturezasJuridicasComponent implements OnInit {
  
  @BlockUI() blockUI: NgBlockUI;

  public naturezasJuridicas: Array<NaturezaJuridica>;

  public settings: CustomTableSettings;
  public selecionados: Array<NaturezaJuridica>;

  public registrosPorPagina: number = 5;
  public pagina: number = 1;
  public totalPaginas: number = 0;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private naturezaJuridicaService: NaturezaJuridicaService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ){ }
  
  ngOnInit() {
    this.configurarTabela();
    this.obterNaturezasJuridicas();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn("#", "idNaturezaJuridica", CustomTableColumnType.text),
        new CustomTableColumn("Código", "codigo", CustomTableColumnType.text),
        new CustomTableColumn("Descrição", "descricao", CustomTableColumnType.text),
        new CustomTableColumn("Categoria", "categoria", CustomTableColumnType.text)
      ], "check"
    );
  }

  // TODO: Criar paginacao para a lista
  private obterNaturezasJuridicas(itensPorPagina: number = 5, pagina: number = 1, termo: string = "") {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.naturezaJuridicaService.listar().subscribe(
      response => {
        if (response) {
          this.naturezasJuridicas = response;
        }
        else {
          this.naturezasJuridicas = new Array<NaturezaJuridica>();
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(),
      reason => {});
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.naturezaJuridicaService.excluir(this.selecionados[0].idNaturezaJuridica).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.obterNaturezasJuridicas();
    }, error => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }

  public selecao(naturezas: Array<NaturezaJuridica>) {
    this.selecionados = naturezas;
  }

  // public paginacao(event) {
  //   this.obterNaturezasJuridicas(event.recordsPerPage, event.currentPage, "");
  // }
}
