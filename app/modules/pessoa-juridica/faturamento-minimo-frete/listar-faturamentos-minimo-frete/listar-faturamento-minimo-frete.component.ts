import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, FaturamentoMinimoFrete, RegraFaturamento, TipoFrete } from '@shared/models';
import { FaturamentoMinimoFreteService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { FaturamentoMinimoFreteFiltro } from '../../../../shared/models/fltros/faturamento-minimo-frete-filtro';
import { ManterFaturamentoMinimoFreteComponent } from '../manter-faturamento-minimo-frete/manter-faturamento-minimo-frete.component';

@Component({
  selector: 'listar-faturamento-minimo-frete',
  templateUrl: './listar-faturamento-minimo-frete.component.html',
  styleUrls: ['./listar-faturamento-minimo-frete.component.scss'],
})
export class ListarFaturamentoMinimoFreteComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-pessoa') idPessoa: number;
  @Input('disabled') disabled: boolean;

  settings: CustomTableSettings;
  faturamentos: Array<FaturamentoMinimoFrete>;
  selecionados: Array<FaturamentoMinimoFrete>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;

  faturamentoMinimoFreteFiltro: FaturamentoMinimoFreteFiltro = new FaturamentoMinimoFreteFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private faturamentoMinimoService: FaturamentoMinimoFreteService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterfaturamentos();
  }

  obterfaturamentos(termo: string = '') {

    this.faturamentoMinimoFreteFiltro.idPessoa = this.idPessoa;
    this.faturamentoMinimoFreteFiltro.itensPorPagina = this.itensPorPagina;
    this.faturamentoMinimoFreteFiltro.pagina = this.pagina;
    this.faturamentoMinimoFreteFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.faturamentoMinimoService.filtrar(this.faturamentoMinimoFreteFiltro).subscribe(
      (response) => {
        if (response) {
          this.faturamentos = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.faturamentos = new Array<FaturamentoMinimoFrete>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  selecao(faturamentos: Array<FaturamentoMinimoFrete>) {
    this.selecionados = faturamentos;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterfaturamentos('');
  }

  //#region Manter Endereco
  incluirFaturamento() {
    const modalRef = this.modalService.open(ManterFaturamentoMinimoFreteComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.pagina = 1;
          this.obterfaturamentos();
        }
      },
    );
  }

  editarFaturamento() {
    const modalRef = this.modalService.open(ManterFaturamentoMinimoFreteComponent, { centered: true, size: 'lg' });
    if (this.selecionados && this.selecionados.length) {
      modalRef.componentInstance.idFaturamentoMinimoFrete = this.selecionados[0].idFaturamentoMinimoFrete;
    }
    modalRef.componentInstance.idPessoa = this.idPessoa;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.pagina = 1;
          this.obterfaturamentos();
        }
      },
    );
  }
  //#endregion

  // #region Exclusao de Endereco
  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }

  private construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Tipo de Frete', 'tipoFrete', CustomTableColumnType.enum, null, null, TipoFrete),
        new CustomTableColumn('Regra', 'regra', CustomTableColumnType.enum, null, null, RegraFaturamento),
        new CustomTableColumn('Estado', 'estado.nome', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Cidade', 'cidade.nome', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Faturamento Mínimo', 'valor', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
      ], 'check',
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.faturamentoMinimoService.deletarBatch(this.selecionados).subscribe((resultado) => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.pagina = 1;
      this.obterfaturamentos();
    }, (error) => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }

  // #endregion
}
