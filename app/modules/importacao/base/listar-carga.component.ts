import { Injector, OnInit, Type } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ColunaComBotoes,
  CustomTableColumn,
  CustomTableColumnType,
  CustomTableSettings,
  Ordenacao,
  PessoaJuridica
} from '@shared/models';
import {
  ArquivoService, AutenticacaoService, ImportacaoService, PessoaJuridicaService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ConfirmacaoComponent } from '../../../shared/components/modals/confirmacao/confirmacao.component';
import { ImportType } from '../../../shared/models/enums/ImportType.enum';
import { SituacaoImportacao } from '../../../shared/models/enums/situacao-importacao';
import { ImportGeneric } from '../../../shared/models/importGeneric';
import { ImportacaoModeloService } from '../../../shared/providers/importacao-modelo.service';
import { ErrorService } from '../../../shared/utils/error.service';

export abstract class ListarCargaComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  importations = new Array<ImportGeneric>();
  selectedImportations = new Array<ImportGeneric>();
  itemOrdenar: string = 'importId';
  ordenacao: Ordenacao = Ordenacao.DESC;
  settings: CustomTableSettings;
  itensPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  termo = '';
  colunasComBotoes = [
    { titulo: 'Arquivo', botoes: [{ title: 'Baixar Arquivo', icone: 'fas fa-download' }] },
    { titulo: 'Erros', botoes: [{ title: 'Baixar Arquivo de Erros', icone: 'fas fa-download' }] },
  ] as Array<ColunaComBotoes>;
  clients: Array<PessoaJuridica>;
  clientSelected: PessoaJuridica;
  clientSelectedIdTenant: number;
  authService: AutenticacaoService = this.injectorEngine.get(AutenticacaoService as Type<AutenticacaoService>);

  protected translationLibrary: TranslationLibraryService = this.injectorEngine.get(TranslationLibraryService as Type<TranslationLibraryService>);
  protected toastr: ToastrService = this.injectorEngine.get(ToastrService as Type<ToastrService>);
  protected importacaoService: ImportacaoService = this.injectorEngine.get(ImportacaoService as Type<ImportacaoService>);
  protected importacaoModeloService: ImportacaoModeloService = this.injectorEngine.get(ImportacaoModeloService as Type<ImportacaoModeloService>);
  protected arquivoService: ArquivoService = this.injectorEngine.get(ArquivoService as Type<ArquivoService>);
  protected modalService: NgbModal = this.injectorEngine.get(NgbModal as Type<NgbModal>);
  protected pessoaJuridicaService: PessoaJuridicaService = this.injectorEngine.get(PessoaJuridicaService as Type<PessoaJuridicaService>);
  protected errorService: ErrorService = this.injectorEngine.get(ErrorService as Type<ErrorService>);

  protected abstract importType: ImportType;

  constructor(private injectorEngine: Injector) {
    super();
  }

  ngOnInit() {
    this.getClients();
    this.getImportations();
    this.configurarTabela();
  }

  getClients() {
    this.pessoaJuridicaService.ObterCompradores().subscribe((response) => {
      if (response) {
        this.clients = response;
      }
    });
  }

  setClientSelected(event) {
    this.clientSelected = event;
  }

  getImportations() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.importacaoService
      .filterImportations(
        this.itemOrdenar,
        this.ordenacao,
        this.itensPorPagina,
        this.pagina,
        this.termo,
        this.importType,
        this.clientSelectedIdTenant,
      )
      .subscribe(
        (response) => {
          if (response) {
            this.importations = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.importations = new Array<ImportGeneric>();
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

  campoBuscaChanged() {
    if (this.termo == null || this.termo.length === 0) {
      this.buscar();
    }
  }

  buscar() {
    this.pagina = 1;
    this.getImportations();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.getImportations();
  }

  ordenar(event) { }

  agruparSelecionados(selecionados: Array<ImportGeneric>) {
    this.selectedImportations = selecionados;
  }

  upload() {
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  baixarArquivo(event) {
    if (event.indexColunaExtra === 0) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.arquivoService.downloadFile(
        this.importations[event.indexItem].importedFileId,
        this.importations[event.indexItem].importedFile.nome).pipe(
          takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe();
    } else {
      if (
        this.importations[event.indexItem].fileErrorsId &&
        this.importations[event.indexItem].fileErrorsId > 0
      ) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);

        this.arquivoService.downloadFile(
          this.importations[event.indexItem].fileErrorsId,
          'Arquivo_de_Erros_da_Importacao_' + this.importations[event.indexItem].importId + '.txt').pipe(
            takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe();
      } else {
        const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
        modalRef.componentInstance.confirmacao = 'Não há arquivo de erros para esta importação';
        modalRef.componentInstance.confirmarLabel = 'none';
        modalRef.componentInstance.cancelarLabel = 'Fechar';
      }
    }
  }

  downloadTemplateFile() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.importacaoModeloService.baixarModeloAtivoPorTipo(this.importType).pipe(
      takeUntil(this.unsubscribe), finalize(() => this.blockUI.stop())).subscribe(
        () => { },
        (error) => {
          this.errorService.treatError(error);
        },
      );
  }

  private configurarTabela() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Código', 'importId', CustomTableColumnType.text, null, null, null),
        new CustomTableColumn(
          'Data de Importação',
          'importDate',
          CustomTableColumnType.text,
          'date',
          'dd/MM/yyyy HH:mm',
          null,
        ),
        new CustomTableColumn(
          'Usuário que importou',
          'userImported.pessoaFisica.nome',
          CustomTableColumnType.text,
          null,
          null,
          null,
        ),
        new CustomTableColumn(
          'Total de Registros Importados',
          'totalImportedRecords',
          CustomTableColumnType.text,
          null,
          null,
          null,
        ),
        new CustomTableColumn(
          'Total De Registros Com Erros',
          'totalRecordsErrors',
          CustomTableColumnType.text,
          null,
          null,
          null,
        ),
        new CustomTableColumn(
          'Cliente',
          'buyer.razaoSocial',
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

    if([ImportType.ProdutosIA, ImportType.PrecificacaoProdutosIA].includes(this.importType)  ){
        this.settings.columns.splice(5, 1, new CustomTableColumn('% Itens Processados I.A', 'aiProcess', CustomTableColumnType.text, null, null, null))
    }
    if([ImportType.PrecificacaoProdutosIA].includes(this.importType)  ){
        this.settings.columns.splice(6, 1, new CustomTableColumn('Status', 'situacaoImportacao', CustomTableColumnType.enum, null, null, SituacaoImportacao))
    }
  }
}
