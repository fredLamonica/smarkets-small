import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import {
  CustomTableColumn,
  CustomTableColumnType, CustomTableSettings,
  DomicilioBancario, Ordenacao
} from '@shared/models';
import { DomicilioBancarioService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { DomicilioBancarioFiltro } from '../../../../shared/models/fltros/domicilio-bancario-filtro';
import { ManterDomicilioBancarioComponent } from './../manter-domicilio-bancario/manter-domicilio-bancario.component';

@Component({
  selector: 'listar-domicilios-bancarios',
  templateUrl: './listar-domicilios-bancarios.component.html',
  styleUrls: ['./listar-domicilios-bancarios.component.scss'],
})
export class ListarDomiciliosBancariosComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number | undefined;

  settings: CustomTableSettings;
  domicilios: Array<DomicilioBancario>;
  selecionados: Array<DomicilioBancario>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.ASC;
  itemOrdenar: string = 'db.IdDomicilioBancario';
  domicilioBancarioFiltro: DomicilioBancarioFiltro = new DomicilioBancarioFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private domicilioService: DomicilioBancarioService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterDomicilios();
  }

  obterDomicilios(termo: string = '') {

    this.domicilioBancarioFiltro.idPessoa = this.idPessoa;
    this.domicilioBancarioFiltro.itemOrdenar = this.itemOrdenar;
    this.domicilioBancarioFiltro.itensPorPagina = this.itensPorPagina;
    this.domicilioBancarioFiltro.ordenacao = this.ordenacao;
    this.domicilioBancarioFiltro.pagina = this.pagina;
    this.domicilioBancarioFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.domicilioService.filtrar(this.domicilioBancarioFiltro).subscribe(
      (response) => {
        if (response) {
          this.domicilios = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.domicilios = new Array<DomicilioBancario>();
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

  selecao(domicilios: Array<DomicilioBancario>) {
    this.selecionados = domicilios;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterDomicilios('');
  }

  //#region Manter Domicilio
  manterDomicilio() {
    const modalRef = this.modalService.open(ManterDomicilioBancarioComponent, {
      centered: true,
      size: 'lg',
    });
    if (this.selecionados && this.selecionados.length) {
      modalRef.componentInstance.idDomicilio = this.selecionados[0].idDomicilioBancario;
    }
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.result.then((result) => {
      if (result) {
        this.pagina = 1;
        this.obterDomicilios();
      }
    });
  }
  //#endregion

  // #region Exclusao de Domicilio
  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }

  private construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Banco', 'banco.descricao', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Agência', 'agencia', CustomTableColumnType.text, null, null),
        new CustomTableColumn(
          'Conta Corrente',
          'contaCorrente',
          CustomTableColumnType.text,
          null,
          null,
        ),
      ],
      'check',
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.domicilioService.deletarBatch(this.idPessoa, this.selecionados).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.pagina = 1;
        this.obterDomicilios();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
  // #endregion
}
