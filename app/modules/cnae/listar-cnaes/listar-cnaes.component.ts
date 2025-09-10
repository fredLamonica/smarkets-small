import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { Cnae, CustomTableColumn, CustomTableColumnType, CustomTableSettings } from '@shared/models';
import { CnaeService, TranslationLibraryService } from '@shared/providers';
import { CnaeFiltro } from '../../../shared/models/fltros/cnae-filtro';

@Component({
  selector: 'app-listar-cnaes',
  templateUrl: './listar-cnaes.component.html',
  styleUrls: ['./listar-cnaes.component.scss'],
})

export class ListarCnaesComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  cnaes: Array<Cnae>;

  settings: CustomTableSettings;

  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;

  cnaeFiltro: CnaeFiltro = new CnaeFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private cnaeService: CnaeService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.obterCnaes();
    this.configurarTabela();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterCnaes('');
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'idCnae', CustomTableColumnType.text),
        new CustomTableColumn('CNAE', 'identificador', CustomTableColumnType.text),
        new CustomTableColumn('Descrição', 'descricao', CustomTableColumnType.text),
      ], 'none',
    );
  }

  private obterCnaes(termo: string = '') {

    this.cnaeFiltro.termo = termo;
    this.cnaeFiltro.itensPorPagina = this.registrosPorPagina;
    this.cnaeFiltro.pagina = this.pagina;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cnaeService.filtrar(this.cnaeFiltro).subscribe(
      (response) => {
        if (response) {
          this.cnaes = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.cnaes = new Array<Cnae>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
