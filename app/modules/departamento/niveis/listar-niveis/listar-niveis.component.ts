import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Nivel, Ordenacao } from '@shared/models';
import { DepartamentoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AprovacaoNivelFiltro } from '../../../../shared/models/fltros/aprovacao-nivel-filtro';
import { ManterNivelComponent } from '../manter-nivel/manter-nivel.component';

@Component({
  selector: 'listar-niveis',
  templateUrl: './listar-niveis.component.html',
  styleUrls: ['./listar-niveis.component.scss'],
})
export class ListarNiveisComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input('id-departamento') idDepartamento: number;

  // public Situacao = Situacao;

  settings: CustomTableSettings;
  niveis: Array<Nivel>;
  niveisSelecionados: Array<Nivel>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.ASC;
  itemOrdenar: string = 'n.Valor';
  aprovacaoNivelFiltro: AprovacaoNivelFiltro = new AprovacaoNivelFiltro();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.construirTabelas();
    this.obterNiveis();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Descrição', 'descricao', CustomTableColumnType.text),
        new CustomTableColumn('Valor', 'valor', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
      ], 'check',
    );
  }

  selecao(itens: Array<Nivel>) {
    this.niveisSelecionados = itens;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterNiveis('');
  }

  // #region Deleção

  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }
  // #endregion

  //#region  Modal Manter Nível

  incluirNivel() {
    const modalRef = this.modalService.open(ManterNivelComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idDepartamento = this.idDepartamento;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.pagina = 1;
          this.obterNiveis();
        }
      },
    );
  }

  alterarNivel() {
    const modalRef = this.modalService.open(ManterNivelComponent, { centered: true, size: 'lg' });
    if (this.niveis && this.niveisSelecionados.length) {
      modalRef.componentInstance.idNivel = this.niveisSelecionados[0].idNivel;
    }
    modalRef.componentInstance.idDepartamento = this.idDepartamento;
    modalRef.result.then(
      (result) => {
        if (result) {
          this.pagina = 1;
          this.obterNiveis();
        }
      },
    );
  }

  private obterNiveis(termo: string = '') {

    this.aprovacaoNivelFiltro.idDepartamento = this.idDepartamento;
    this.aprovacaoNivelFiltro.itensPorPagina = this.itensPorPagina;
    this.aprovacaoNivelFiltro.pagina = this.pagina;
    this.aprovacaoNivelFiltro.termo = termo;
    this.aprovacaoNivelFiltro.ordenacao = this.ordenacao;
    this.aprovacaoNivelFiltro.itemOrdenar = this.itemOrdenar;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.filtrarNiveis(this.aprovacaoNivelFiltro).subscribe(
      (response) => {
        if (response) {
          this.niveis = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.niveis = new Array<Nivel>();
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
    this.departamentoService.deletaNiveisBatch(this.idDepartamento, this.niveisSelecionados).subscribe((resultado) => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.pagina = 1;
      this.obterNiveis();
    }, (error) => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }
  // #endregion

}
