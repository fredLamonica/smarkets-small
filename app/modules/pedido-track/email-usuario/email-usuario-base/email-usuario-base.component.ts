import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { ColumnTypeEnum } from '../../../../shared/components/data-list/models/column-type.enum';
import { SelectionModeEnum } from '../../../../shared/components/data-list/models/selection-mode.enum';
import { SizeEnum } from '../../../../shared/components/data-list/models/size.enum';
import { TableColumn } from '../../../../shared/components/data-list/table/models/table-column';
import { TableConfig } from '../../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../../shared/components/data-list/table/models/table-pagination';
import { TableStyleEnum } from '../../../../shared/components/data-list/table/models/table-style.enum';
import { Paginacao } from '../../../../shared/models';
import { EmailUsuarioDto } from '../../../../shared/models/dto/email-usuario-dto';
import { EmailUsuarioFiltroDto } from '../../../../shared/models/dto/email-usuario-filtro-dto';
import { SituacaoEmail } from '../../../../shared/models/enums/situacao-email';
import { TipoEmail } from '../../../../shared/models/enums/tipo-email';
import { TipoOperacaoTrack } from '../../../../shared/models/enums/Track/tipo-operacao-track';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { TranslationLibraryService } from '../../../../shared/providers';
import { ErrorService } from '../../../../shared/utils/error.service';
import { PedidoTrackService } from './../../../../shared/providers/track/pedido-track.service';

export abstract class EmailUsuarioBaseComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  rotaVoltar: string = '';
  titulo: string = 'Pedido Track / ';
  tituloComplementar: string = '/ Histórico de Emails';
  itensDaTable?: Array<EmailUsuarioDto>;
  paginacao: Paginacao<EmailUsuarioDto>;
  formFiltro: FormGroup;
  opcoesSituacaoEmail: Array<any>;

  filtro: EmailUsuarioFiltroDto;

  configuracaoDaTable: TableConfig<EmailUsuarioDto> = {
    columns: this.obtenhaColunas()
  } as TableConfig<EmailUsuarioDto>;

  situacaoEmailEnum = SituacaoEmail;
  tipoEmailEnum = TipoEmail;

  readonly nenhumRegistroEncontrado: string = 'Nenhum registro encontrado!';

  protected tipoOperacao: TipoOperacaoTrack;
  protected descricaoFuncionalidade: string;

  constructor(
    private fb: FormBuilder,
    private pedidoTrackService: PedidoTrackService,
    private errorService: ErrorService,
    private translationLibrary: TranslationLibraryService,

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

  filtreItens(resetarPagina: boolean = false, termo: string = ''): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.filtro.termo = termo;

    this.pedidoTrackService
      .filtrarPorTipoOperacao(this.filtro)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
      (paginacao: Paginacao<EmailUsuarioDto>) => {
        this.paginacao = paginacao;
        this.configureGrid();
        this.itensDaTable = paginacao.itens
        this.blockUI.stop();
      },
      (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      }
    )
  }

  private inicialize(): void {
    this.opcoesSituacaoEmail = new EnumToArrayPipe().transform(SituacaoEmail) as Array<any>;

    this.filtro =
    {
      pagina: 1,
      itensPorPagina: 5,
      tipoOperacao: this.tipoOperacao
    } as EmailUsuarioFiltroDto;

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
    } as TableConfig<EmailUsuarioDto>;
  }

  private construaFormFiltro() {
    this.formFiltro = this.fb.group({
      situacaoEmail: [null],
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
        name: 'idImportacao',
        title: 'Id da Importação',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'destinatario',
        title: 'Destinatário',
        type: ColumnTypeEnum.Text,
      },
      {
        name: 'tipoEmail',
        title: 'Tipo de Email',
        type: ColumnTypeEnum.CustomTemplate,
      },
      {
        name: 'situacao',
        title: 'Situação',
        type: ColumnTypeEnum.CustomTemplate,
      },
    ]
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
