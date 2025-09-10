import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CentroCustoAlcada, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Situacao } from '@shared/models';
import { CentroCustoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CentroCustoAlcadaFiltro } from '../../../../shared/models/fltros/centro-custo-alcada-filtro';
import { ManterAlcadaCentroCustoComponent } from '../manter-alcada-centro-custo/manter-alcada-centro-custo.component';

@Component({
  selector: 'listar-alcadas-centro-custo',
  templateUrl: './listar-alcadas-centro-custo.component.html',
  styleUrls: ['./listar-alcadas-centro-custo.component.scss'],
})
export class ListarAlcadasCentroCustoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-centro-custo') idCentroCusto: number;

  Situacao = Situacao;

  settings: CustomTableSettings;
  alcadas: Array<CentroCustoAlcada>;
  alcadasSelecionadas: Array<CentroCustoAlcada>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  centroCustoAlcadaFiltro: CentroCustoAlcadaFiltro = new CentroCustoAlcadaFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private centroCustoService: CentroCustoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterAlcadas();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Código', 'codigo', CustomTableColumnType.text),
        new CustomTableColumn('Descrição', 'descricao', CustomTableColumnType.text),
        new CustomTableColumn('Valor', 'valor', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
        new CustomTableColumn('Aprovador', 'aprovador.pessoaFisica.nome', CustomTableColumnType.text),
        new CustomTableColumn('Situação', 'situacao', CustomTableColumnType.enum, null, null, Situacao),
      ], 'check',
    );
  }

  selecao(itens: Array<CentroCustoAlcada>) {
    this.alcadasSelecionadas = itens;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterAlcadas();
  }

  // #region Deleção
  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }
  // #endregion

  // #region Alterar situacao
  alterarSituacao(situacao: Situacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.centroCustoService.alterarSituacaoAlcadasBatch(this.idCentroCusto, this.alcadasSelecionadas, situacao).subscribe((resultado) => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();

      this.obterAlcadas();
    }, (error) => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }
  // #endregion

  //#region  Modal Manter Item
  manterAlcada() {
    const modalRef = this.modalService.open(ManterAlcadaCentroCustoComponent, { centered: true, size: 'lg' });
    if (this.alcadas && this.alcadasSelecionadas.length) {
      modalRef.componentInstance.idAlcada = this.alcadasSelecionadas[0].idCentroCustoAlcada;
    }
    modalRef.componentInstance.idCentroCusto = this.idCentroCusto;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.pagina = 1;
          this.obterAlcadas();
        }
      },
    );
  }

  private obterAlcadas(termo: string = '') {

    this.centroCustoAlcadaFiltro.idCentroCusto = this.idCentroCusto;
    this.centroCustoAlcadaFiltro.itensPorPagina = this.itensPorPagina;
    this.centroCustoAlcadaFiltro.pagina = this.pagina;
    this.centroCustoAlcadaFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.centroCustoService.filtrarAlcadas(this.centroCustoAlcadaFiltro).subscribe(
      (response) => {
        if (response) {
          this.alcadas = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.alcadas = new Array<CentroCustoAlcada>();
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
    this.centroCustoService.deletarAlcadasBatch(this.idCentroCusto, this.alcadasSelecionadas).subscribe((resultado) => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();

      this.pagina = 1;
      this.obterAlcadas();
    }, (error) => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }
  //#endregion

}
