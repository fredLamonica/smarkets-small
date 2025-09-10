import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { SelectionModeEnum } from '../../../../shared/components/data-list/models/selection-mode.enum';
import { TableConfig } from '../../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../../shared/components/data-list/table/models/table-pagination';
import { ConfigTableFerramentas } from '../../../../shared/components/funcionalidade/smk-table-funcionalidade/models/config-table-ferramentas';
import { Usuario } from '../../../../shared/models';
import { ConfiguracaoColunaDto } from '../../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../../shared/models/configuracao-filtro-usuario-dto';
import { NotificacaoDto } from '../../../../shared/models/dto/notificacao-dto';
import { NotificacaoUsuarioFiltroDto } from '../../../../shared/models/notificacoes/notificacao-usuario-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../../../shared/models/paginacao-pesquisa-configurada-dto';
import { ArquivoService, TranslationLibraryService } from '../../../../shared/providers';
import { UsuarioService } from '../../../../shared/providers/usuario.service';
import { ErrorService } from '../../../../shared/utils/error.service';

@Component({
  selector: 'smk-notificacoes',
  templateUrl: './notificacoes.component.html',
  styleUrls: ['./notificacoes.component.scss'],
})
export class NotificacoesComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  configuracaoFerramentasDaTable: ConfigTableFerramentas;
  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  configuracaoDaTable: TableConfig<NotificacaoDto>;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<NotificacaoDto>;
  notificacaoSelecionada: NotificacaoDto;
  formFiltro: FormGroup;
  filtro: NotificacaoUsuarioFiltroDto;
  filtroInformado: boolean;
  usuarioLogado: Usuario;

  constructor(
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private errorService: ErrorService,
    private arquivoService: ArquivoService,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  obterNotificoes(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.inicieLoading();
    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.usuarioService.filtreNotificacoes(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
      (paginacaoPesquisaConfigurada) => {
          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();
          if (emitirToastrDeSucesso) {
            this.emitirToastrDeSucesso();
          }
        },
        (error) => this.errorService.treatError(error));
  }

    pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.obterNotificoes(false);
  }
  filtre(): void {
    this.obterNotificoes(false, true);
  }
  limpeFiltro(): void {
    this.formFiltro.reset();
    this.obterNotificoes(false, true);
  }

  exporte(): void {
    this.inicieLoading();

    this.usuarioService.exporteNotificacoes(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Notificações.xls`,
          );

          this.emitirToastrDeSucesso();
        },
        (error) => this.errorService.treatError(error));
  }

  origensSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  private construaFormFiltro(): void {
    this.formFiltro = this.fb.group({
      titulo: [null],
      mensagem: [null],
      dataCriacao: [null],
    });

    this.formFiltro.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((valores) => {
        this.filtro = { ...this.filtro, ...valores };

        let filtroInformado = false;

        for (const property of Object.keys(valores)) {
          if (valores[property] !== null && valores[property] !== '') {
            filtroInformado = true;
            break;
          }
        }

        this.filtroInformado = filtroInformado;
      });

  }

  private obterNotificacaoInicializacao(): void {
    this.inicieLoading();

    this.usuarioService.obtenhaFiltroSalvoNotificacao().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: NotificacaoUsuarioFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.obterNotificoes(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  private inicialize(): void {
     this.obtenhaColunasDisponiveis();
     this.construaFormFiltro();
    this.obterNotificacaoInicializacao();
  }

    private obtenhaColunasDisponiveis(): void {
    this.usuarioService.obtenhaColunasDiponiveis().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

private configureGrid(): void {
    this.configuracaoDaTable = new TableConfig<NotificacaoDto>({
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
      selectionMode: SelectionModeEnum.None,
    });
  }

  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

}
