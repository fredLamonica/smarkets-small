import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Arquivo, CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao } from '@shared/models';
import { ArquivoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ContratoCatalogoArquivoFiltro } from '../../../../shared/models/fltros/contrato-catalogo-arquivo-filtro';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'listar-anexos-contrato',
  templateUrl: './listar-anexos-contrato.component.html',
  styleUrls: ['./listar-anexos-contrato.component.scss'],
})
export class ListarAnexosContratoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;

  anexos: Array<Arquivo>;

  anexosSelecionados: Array<Arquivo>;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.ASC;
  itemOrdenar: string = 'a.IdArquivo';
  contratoCatalogoArquivoFiltro: ContratoCatalogoArquivoFiltro = new ContratoCatalogoArquivoFiltro();

  settings: CustomTableSettings;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoCatalogoService: ContratoCatalogoService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.contruirTabela();
    this.obterArquivos();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterArquivos();
  }

  //#region Inclusao
  async arquivosSelecionados(arquivos: Array<Arquivo>) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.inserirArquivo(arquivos[i]);
      }
      this.inserirContratoArquivos(arquivos);
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }
  //#endregion

  //#region Exclusão
  selecaoExclusao(arquivos: Array<Arquivo>) {
    this.anexosSelecionados = arquivos;
  }

  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }
  //#endregion

  //#region Downloads
  download() {
    for (let i = 0; i < this.anexosSelecionados.length; i++) {
      // tslint:disable-next-line: no-unused-expression
      <any>window.open(this.anexosSelecionados[i].url);
    }
  }

  private contruirTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'idArquivo', CustomTableColumnType.text, null, null),
        new CustomTableColumn('Anexo', 'nome', CustomTableColumnType.text, null, null),
      ], 'check',
    );
  }

  private obterArquivos(termo: string = '') {

    this.contratoCatalogoArquivoFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoArquivoFiltro.itemOrdenar = this.itemOrdenar;
    this.contratoCatalogoArquivoFiltro.itensPorPagina = this.itensPorPagina;
    this.contratoCatalogoArquivoFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoArquivoFiltro.pagina = this.pagina;
    this.contratoCatalogoArquivoFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService.filtrarArquivos(this.contratoCatalogoArquivoFiltro).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.anexos = response.itens;
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.anexos = new Array<Arquivo>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
      );
  }

  private inserirContratoArquivos(arquivos: Array<Arquivo>) {
    this.contratoCatalogoService.inserirArquivos(this.idContrato, arquivos).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
        this.pagina = 1;
        this.obterArquivos();
      }, (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      },
      );
  }

  private inserirArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoCatalogoService.deletarArquivos(this.idContrato, this.anexosSelecionados).pipe(
      takeUntil(this.unsubscribe))
      .subscribe((response) => {
        const ids = this.anexosSelecionados.map((a) => a.idArquivo);
        this.pagina = 1;
        this.obterArquivos();
        this.blockUI.stop();
      }, (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      },
      );
  }
  //#endregion
}
