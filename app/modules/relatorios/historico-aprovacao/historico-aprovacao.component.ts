import { Component, OnInit } from '@angular/core';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Fornecedor, Usuario } from '@shared/models';
import { AprovacaoPedidoRelatorio } from '@shared/models/relatorio/aprovacao-pedido-relatorio';
import { ArquivoService, CategoriaProdutoService, FornecedorService, TranslationLibraryService } from '@shared/providers';
import { RelatoriosService } from '@shared/providers/relatorios.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { catchError, shareReplay, takeUntil, tap } from 'rxjs/operators';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { UsuarioService } from '../../../shared/providers/usuario.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-historico-aprovacao',
  templateUrl: './historico-aprovacao.component.html',
  styleUrls: ['./historico-aprovacao.component.scss'],
})
export class HistoricoAprovacaoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  nomesFornecedores: Array<string> = new Array<string>();
  nomesAprovadores: Array<string> = new Array<string>();
  nomesCompradores: Array<string> = new Array<string>();
  categorias: Array<string> = new Array<string>();

  dataInicio: string;
  dataFim: string;
  fornecedor: string;
  aprovador: string;
  compradores: string;
  categoria: string;

  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;

  relatorioPedidosLoading: boolean;
  pedidosRelatorio: Array<AprovacaoPedidoRelatorio>;
  settings: CustomTableSettings;

  // Fornecedores
  fornecedores$: Observable<Array<Fornecedor>>;
  fornecedoresLoading: boolean;

  // Aprovadores
  usuarios$: Observable<Array<Usuario>>;
  usuariosLoading: boolean;

  // Compradores
  compradores$: Observable<Array<Usuario>>;
  compradoresLoading: boolean;

  // Categorias
  categorias$: Observable<Array<Usuario>>;
  categoriasLoading: boolean;

  constructor(
    private relatorioService: RelatoriosService,
    private arquivoService: ArquivoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private fornecedorService: FornecedorService,
    private usuarioService: UsuarioService,
    private categoriaService: CategoriaProdutoService,
  ) {
    super();
  }

  ngOnInit() {
    this.dataInicio = moment().startOf('month').format('YYYY-MM-DD');
    this.dataFim = moment().endOf('month').format('YYYY-MM-DD');
    this.configurarTabelaRelatorio();
  }

  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterRelatorio();
  }

  openFornecedores() {
    if (!this.fornecedores$) {
      this.subFornecedores();
    }
  }

  customSearchFornecedor(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.razaoSocial.toLocaleLowerCase().indexOf(term) > -1 ||
      item.razaoSocial.toLocaleLowerCase().indexOf(term) > -1;
  }

  openUsuarios() {
    if (!this.usuarios$) {
      this.subUsuarios();
    }
  }

  listeCompradores() {
    if (!this.compradores$) {
      this.subCompradores();
    }
  }

  customSearchAprovador(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.pessoaFisica.nome.toLocaleLowerCase().indexOf(term) > -1 ||
      item.pessoaFisica.nome.toLocaleLowerCase().indexOf(term) > -1;
  }

  customSearchCompradores(term: string, item: any) {
    term = term.toLowerCase();
    return item.pessoaFisica.nome.toLowerCase().indexOf(term) > -1 ||
      item.pessoaFisica.nome.toLowerCase().indexOf(term) > -1;
  }

  openCategorias() {
    if (!this.categorias$) {
      this.subCategorias();
    }
  }

  customSearchCategorias(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.pessoaFisica.nome.toLocaleLowerCase().indexOf(term) > -1 ||
      item.pessoaFisica.nome.toLocaleLowerCase().indexOf(term) > -1;
  }

  montarTabela() {
    if (this.datasValidas()) {
      this.montarFiltro();
      this.obterRelatorio();
    }
  }

  montarFiltro() {
    this.fornecedor = this.nomesFornecedores.join(';');
    this.aprovador = this.nomesAprovadores.join(';');
    this.compradores = this.nomesCompradores.join(';');
    this.categoria = this.categorias.join(';');
  }

  downloadRelatorioHistoricoAprovacao() {
    if (this.datasValidas()) {
      this.blockUI.start();
      this.montarFiltro();
      this.relatorioService.obterHistoricoAprovacao(this.dataInicio, this.dataFim, this.fornecedor, this.aprovador, this.compradores, this.categoria)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            if (response.size > 0) {
              this.arquivoService.createDownloadElement(response, `Relatório_aprovação de ${this.dataInicio} até ${this.dataFim}.xls`);
              this.blockUI.stop();
            } else {
              this.toastr.warning('Nenhum registro encontrado.');
              this.blockUI.stop();
            }
          }, () => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    }
  }

  obterRelatorio() {
    this.relatorioPedidosLoading = true;
    this.montarFiltro();
    this.relatorioService.filtrar('[pi].IdPedido', 'ASC', this.registrosPorPagina, this.pagina,
      this.dataInicio, this.dataFim, this.fornecedor, this.aprovador, this.compradores, this.categoria)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response != null) {
            this.pedidosRelatorio = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.pedidosRelatorio = new Array<AprovacaoPedidoRelatorio>();
            this.totalPaginas = 1;
          }
          this.relatorioPedidosLoading = false;
        }, () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.relatorioPedidosLoading = false;
        },
      );

  }

  private configurarTabelaRelatorio() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Nº pedido', 'Pedido', CustomTableColumnType.text),
        new CustomTableColumn('Código', 'CodPedido', CustomTableColumnType.text),
        new CustomTableColumn('Descrição', 'Descricao', CustomTableColumnType.text),
        new CustomTableColumn('Código Produto Plataforma', 'CodPlat', CustomTableColumnType.text),
        new CustomTableColumn('Código ERP', 'CodERP', CustomTableColumnType.text),
        new CustomTableColumn('CNPJ', 'Cnpj', CustomTableColumnType.text),
        new CustomTableColumn('Fornecedor', 'Fornecedor', CustomTableColumnType.text),
        new CustomTableColumn('Comprador', 'Comprador', CustomTableColumnType.text),
        new CustomTableColumn('Aprovador', 'Aprovador', CustomTableColumnType.text),
        new CustomTableColumn('Data Pedido', 'DataPedido', CustomTableColumnType.text, 'date', 'dd/MM/yyyy HH:mm'),
        new CustomTableColumn('Data Aprovação (Interna)', 'DataAprovacaoInterna', CustomTableColumnType.text, 'date', 'dd/MM/yyyy HH:mm'),
        new CustomTableColumn('Data Confirmação (Fornecedor)', 'DataConfirmacaoFornecedor', CustomTableColumnType.text, 'date', 'dd/MM/yyyy HH:mm'),
        new CustomTableColumn('Valor do Pedido', 'ValorPedido', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
        new CustomTableColumn('Status Pedido', 'StatusPedido', CustomTableColumnType.text),
      ], 'none',
    );
  }

  private subFornecedores() {
    this.fornecedoresLoading = true;
    this.fornecedores$ = this.fornecedorService.obterPorRazaoSocial('').pipe(
      catchError(() => of([])),
      tap(() => this.fornecedoresLoading = false),
      shareReplay(),
    );
  }

  private subUsuarios() {
    this.usuariosLoading = true;
    this.usuarios$ = this.usuarioService.listarAprovadores().pipe(
      catchError(() => of([])),
      tap(() => this.usuariosLoading = false),
      shareReplay(),
    );
  }

  private subCompradores() {
    this.compradoresLoading = true;
    this.compradores$ = this.usuarioService.listeCompradores().pipe(
      catchError(() => of([])),
      tap(() => this.compradoresLoading = false),
      shareReplay(),
    );
  }

  private subCategorias() {
    this.categoriasLoading = true;
    this.categorias$ = this.categoriaService.listar().pipe(
      catchError(() => of([])),
      tap(() => this.categoriasLoading = false),
      shareReplay(),
    );
  }

  private datasValidas(): boolean {
    if (this.dataInicio === '' && this.dataFim === '') {
      this.toastr.warning('Preencha corretamente as datas de início e fim');
      return false;
    } else if (this.dataInicio === '') {
      this.toastr.warning('Data inicial inválida');
      return false;
    } else if (this.dataFim === '') {
      this.toastr.warning('Data final inválida');
      return false;
    } else if (this.dataInicio > this.dataFim) {
      this.toastr.warning('Data inicial maior que data final');
      return false;
    }

    return true;
  }

}
