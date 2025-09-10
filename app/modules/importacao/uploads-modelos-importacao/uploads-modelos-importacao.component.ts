import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { ConfirmacaoComponent } from '../../../shared/components';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ColunaComBotoes, CustomTableColumn, CustomTableColumnType } from '../../../shared/models';
import { Arquivo } from '../../../shared/models/arquivo';
import { CustomTableSettings } from '../../../shared/models/custom-table-settings';
import { ImportType } from '../../../shared/models/enums/ImportType.enum';
import { Ordenacao } from '../../../shared/models/enums/ordenacao';
import { ImportacaoModelo } from '../../../shared/models/importacao-modelo';
import { ImportacaoService, TranslationLibraryService } from '../../../shared/providers';
import { ImportacaoModeloService } from '../../../shared/providers/importacao-modelo.service';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'smk-uploads-modelos-importacao',
  templateUrl: './uploads-modelos-importacao.component.html',
  styleUrls: ['./uploads-modelos-importacao.component.scss'],
})
export class UploadsModelosImportacaoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  importations = new Array<ImportacaoModelo>();
  importacoesModeloSelecionadas = new Array<ImportacaoModelo>();

  tiposImportacao: Array<object>;
  tipoImportacao: ImportType;
  isSmarkets: boolean;
  ordenacao: Ordenacao = Ordenacao.DESC;
  itemOrdenar: string = 'IdModelo';
  settings: CustomTableSettings;
  itensPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  clientSelectedIdTenant: number;
  termo: string = '';
  motivo: string = '';
  arquivoSelecionado: Array<Arquivo>;
  importacaoModelo: Arquivo = null;

  colunasComBotoes = [
    { titulo: 'Ativo', botoes: [{ title: 'Ativar', icone: 'fas fa-toggle-off', iconeCondicional: 'fas fa-toggle-on', colunaValidacao: 'situacao', valorComparacao: '1' }] },
    { titulo: 'Ações', botoes: [{ title: 'Donwload', icone: 'fas fa-download' }, { title: 'Excluir', icone: 'fas fa-trash' }] },
  ] as Array<ColunaComBotoes>;

  protected importType: ImportType;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private importacaoModeloService: ImportacaoModeloService,
    private importacaoService: ImportacaoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.getTiposImportacao();
    this.obterImportacoes();
    this.configurarTabela();
  }

  setTipoImportacao(selected) {
    if (selected) {
      this.tipoImportacao = selected.value;
    } else {
      this.tipoImportacao = null;
    }
    this.obterImportacoes();
  }

  buscar() {
    this.termo = this.termo;
    this.obterImportacoes();
  }

  campoBuscaChanged() { }

  selecionarArquivo(arquivo: Array<Arquivo>) {
    this.importacaoModelo = arquivo[0];
  }
  removerArquivo() {
    this.importacaoModelo = null;
  }

  upload() {

    if (this.importacaoModelo && this.importacaoModelo.url.includes('base64')) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.importacaoModeloService.uploadModelo(this.importacaoModelo, this.tipoImportacao, this.motivo, this.clientSelectedIdTenant).pipe(
        takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
          () => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.obterImportacoes();
            this.limparFormulario();
            this.blockUI.stop();
          },
          (error) => {
            if (error.error) {
              this.toastr.warning(error.error);
            } else {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            }
            this.blockUI.stop();
          },
        );
    } else {
      this.toastr.warning('Arquivo para upload não informado.');
    }

  }

  downloadTemplateFile() { }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterImportacoes();
  }

  obterImportacoes() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.importacaoModeloService
      .filtrarImportacoes(
        this.itemOrdenar,
        this.ordenacao,
        this.itensPorPagina,
        this.pagina,
        this.termo,
        this.tipoImportacao,
        this.clientSelectedIdTenant,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.importations = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.importations = new Array<ImportacaoModelo>();
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

  getTiposImportacao() {
    this.importacaoService.obterTiposImportacao().subscribe((response) => {
      if (response) {
        this.tiposImportacao = response;
      }
    });
  }

  executarAcoes(event) {
    if (event.indexColunaExtra === 0) {

      if (this.importations[event.indexItem].situacao !== 1) {
        const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
        modalRef.componentInstance.confirmacao = `Ativando este modelo de importação, você irá desativar os demais modelos vinculados ao tipo importação ${this.importations[event.indexItem].tipoImportacaoTexto}`;
        modalRef.componentInstance.confirmarLabel = 'Ativar';
        modalRef.result.then(
          (result) => {
            if (result) {
              this.ativarImportacaoModelo(event);
            }
          },
          (reason) => { },
        );
      } else {
        return this.ativarImportacaoModelo(event);
      }

    }

    if (event.indexColunaExtra === 1) {
      if (event.indexBotao === 0) {
        return this.baixarImportacaoModelo(event);
      } else {
        const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
        modalRef.componentInstance.confirmacao = `Tem certeza que deseja excluir o modelo de importação selecionado ?`;
        modalRef.componentInstance.confirmarLabel = 'Excluir';
        modalRef.result.then(
          (result) => {
            if (result) {
              this.deletarImportacaoModelo(event);
            }
          },
          (reason) => { },
        );

      }
    }
  }

  ativarImportacaoModelo(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.importacaoModeloService.ativarModelo(this.importations[event.indexItem].idModelo, this.importations[event.indexItem].tipoImportacao).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        () => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.obterImportacoes();
        },
        (error) => {
          this.errorService.treatError(error);
        },
      );
  }

  baixarImportacaoModelo(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.importacaoModeloService.baixarModelo(
      this.importations[event.indexItem].idModelo,
      this.importations[event.indexItem].nome).pipe(
        takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
          () => {

          },
          (error) => {
            this.errorService.treatError(error);
          },
        );
  }

  deletarImportacaoModelo(event) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.importacaoModeloService.excluirModelo(this.importations[event.indexItem].idModelo).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        () => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.obterImportacoes();
        },
        (error) => {
          this.errorService.treatError(error);
        },
      );
  }

  agruparSelecionados(selecionados: Array<ImportacaoModelo>) {
    this.importacoesModeloSelecionadas = selecionados;
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn(
          'Data e hora do upload',
          'dataUpload',
          CustomTableColumnType.text,
          'date',
          'dd/MM/yyyy HH:mm:ss',
          null,
        ),
        new CustomTableColumn(
          'Usuário',
          'usuarioImportador.pessoaFisica.nome',
          CustomTableColumnType.text,
          null,
          null,
          null,
        ),
        new CustomTableColumn(
          'Tipo de importação',
          'tipoImportacaoTexto',
          CustomTableColumnType.text,
          null,
          null,
          null,
        ),
        new CustomTableColumn(
          'Nome do arquivo modelo',
          'nome',
          CustomTableColumnType.text,
          null,
          null,
          null,
        ),
      ],
      'check',
      null,
      this.ordenacao,
    );
  }
  private limparFormulario() {
    this.motivo = '';
    this.importacaoModelo = null;
  }
}
