import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { takeUntil } from 'rxjs/operators';
import { ConfirmacaoComponent } from '../../../../shared/components';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ColumnTypeEnum } from '../../../../shared/components/data-list/models/column-type.enum';
import { SelectionModeEnum } from '../../../../shared/components/data-list/models/selection-mode.enum';
import { SizeEnum } from '../../../../shared/components/data-list/models/size.enum';
import { TableColumn } from '../../../../shared/components/data-list/table/models/table-column';
import { TableConfig } from '../../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../../shared/components/data-list/table/models/table-pagination';
import { TableStyleEnum } from '../../../../shared/components/data-list/table/models/table-style.enum';
import { Paginacao } from '../../../../shared/models';
import { SituacaoImportacao } from '../../../../shared/models/enums/situacao-importacao';
import { TipoImportacao } from '../../../../shared/models/enums/Track/tipo-importacao';
import { ImportacaoFiltroDto } from '../../../../shared/models/fltros/track/importacao-filtro-dto';
import { ImportacaoDto } from '../../../../shared/models/importacao-dto';
import { ArquivoService, TranslationLibraryService } from '../../../../shared/providers';
import { ImportacaoTrackService } from '../../../../shared/providers/track/importacao-track-service';
import { ErrorService } from '../../../../shared/utils/error.service';


export abstract class ImportacaoBaseComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  rotaVoltar: string = '';
  titulo: string = 'Painel de Operações ';
  tituloComplementar: string = '/ Histórico de Importação';
  itensDaTable?: Array<ImportacaoDto>;
  paginacao: Paginacao<ImportacaoDto>;
  formFiltro: FormGroup;

  filtro: ImportacaoFiltroDto;

  configuracaoDaTable: TableConfig<ImportacaoDto> = {
    columns: this.obtenhaColunas()

  } as TableConfig<ImportacaoDto>;

  readonly nenhumRegistroEncontrado: string = 'Nenhum registro encontrado!';

  protected abstract tipoImportacao: TipoImportacao;
  protected abstract descricaoFuncionalidade: string;

  constructor(
    protected fb: FormBuilder,
    protected importacaoService: ImportacaoTrackService,
    protected errorService: ErrorService,
    protected modalService: NgbModal,
    protected arquivoService: ArquivoService,
    protected translationLibrary: TranslationLibraryService
  ) {
    super();
  }

  ngOnInit(): void {
    this.inicialize();
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtreItens(false);
  }

  baixeArquivoImportacao(idArquivo: number, nomeArquivo: string) {
    this.arquivoService.downloadFile(idArquivo, nomeArquivo)
    .pipe(takeUntil(this.unsubscribe))
    .subscribe();
  }

  baixeArquivoErros(importacao: ImportacaoDto) {
    if (
      importacao.situacaoImportacao == SituacaoImportacao.ProcessadoErro || importacao.qtdErro > 0
    ) {
      this.importacaoService.downloadArquivoErros(
        importacao.id,
        'Arquivo_de_Erros_da_Importacao_' + importacao.id + '.txt')
        .pipe(takeUntil(this.unsubscribe))
        .subscribe();
    } else {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
      modalRef.componentInstance.confirmacao = 'Não há arquivo de erros para esta importação';
      modalRef.componentInstance.confirmarLabel = 'none';
      modalRef.componentInstance.cancelarLabel = 'Fechar';
    }
  }

  private inicialize(): void {
    this.filtro =
    {
      pagina: 1,
      itensPorPagina: 5,
      tipoImportacao: this.tipoImportacao
    } as ImportacaoFiltroDto;

    this.construaFormFiltro();
    this.filtreItens();
  }

  private configureGrid(): void {
    this.configuracaoDaTable = {
      usePagination: true,
      useLocalPagination: false,
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacao ? this.paginacao.numeroPaginas : 0,
      totalItems: this.paginacao ? this.paginacao.total : 0,
      selectionMode: SelectionModeEnum.None,
      columns: this.obtenhaColunas(),
      style: TableStyleEnum.Striped,
      tableHover: true,
      highlightSelected: true,
      emptyStateText: this.nenhumRegistroEncontrado,
      size: SizeEnum.Small
    } as TableConfig<ImportacaoDto>;
  }

  private filtreItens(resetarPagina: boolean = false): void {

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.importacaoService.filtrarImportacaoPorTipo(this.filtro)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
      (paginacao: Paginacao<ImportacaoDto>) => {
        this.paginacao = paginacao;
        this.configureGrid();
        this.itensDaTable = paginacao.itens;
        this.blockUI.stop();
      },
      (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      }
    )
  }

  private construaFormFiltro() {
    this.formFiltro = this.fb.group({
      termo: [null],
      data: [null]
    });

    this.formFiltro.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((valores) => {
        this.filtro = { ...this.filtro, ...valores };
      });
  }

  private obtenhaColunas(): TableColumn[] {
    return [
      {
        name: 'id',
        title: 'Código',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'dataCriacao',
        title: 'Data e hora',
        type: ColumnTypeEnum.DateTime,
      },
      {
        name: 'nomeUsuario',
        title: 'Usuário que importou',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'qtdProcessado',
        title: 'Total de Registros Importados',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'qtdErro',
        title: 'Total de Registros com Erros',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'razaoSocialCliente',
        title: 'Cliente',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'arquivo',
        title: 'Arquivo',
        type: ColumnTypeEnum.CustomTemplate,
      },
      {
        name: 'arquivoErros',
        title: 'Erros',
        type: ColumnTypeEnum.CustomTemplate,
      },
    ]
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
