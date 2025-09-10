import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { ModalConfirmacaoExclusao } from '@shared/components';
import { Banco, CustomTableColumn, CustomTableColumnType, CustomTableSettings } from '@shared/models';
import { BancoService, TranslationLibraryService } from '@shared/providers';
import { BancoFiltro } from '../../../shared/models/fltros/banco-filtro';

@Component({
  selector: 'app-listar-bancos',
  templateUrl: './listar-bancos.component.html',
  styleUrls: ['./listar-bancos.component.scss'],
})
export class ListarBancosComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  bancos: Array<Banco>;

  settings: CustomTableSettings;
  selecionados: Array<Banco>;

  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  itemOrdenar: string = 'IdBanco';
  bancoFiltro: BancoFiltro = new BancoFiltro();

  closeResult: string;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private bancoService: BancoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.configurarTabela();
    this.obterBancos();
  }

  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }

  selecao(bancos: Array<Banco>) {
    this.selecionados = bancos;
  }

  paginacao(event) {
    this.pagina = event.recordsPerPage;
    this.registrosPorPagina = event.page;
    this.obterBancos();
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'idBanco', CustomTableColumnType.text),
        new CustomTableColumn('Código', 'codigo', CustomTableColumnType.text),
        new CustomTableColumn('Descrição', 'descricao', CustomTableColumnType.text),
      ], 'check',
    );
  }

  private obterBancos(termo = '') {

    this.bancoFiltro.itensPorPagina = this.registrosPorPagina;
    this.bancoFiltro.pagina = this.pagina;
    this.bancoFiltro.itemOrdenar = this.itemOrdenar;
    this.bancoFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.bancoService.filtrar(this.bancoFiltro).subscribe(
      (response) => {
        if (response) {
          this.bancos = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.bancos = new Array<Banco>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.bancoService.excluir(this.selecionados[0].idBanco).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.pagina = 1;
        this.obterBancos();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
