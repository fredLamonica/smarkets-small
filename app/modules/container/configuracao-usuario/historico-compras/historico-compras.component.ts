import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { TableConfig } from '../../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../../shared/components/data-list/table/models/table-pagination';
import { ConfigTableFerramentas } from '../../../../shared/components/funcionalidade/smk-table-funcionalidade/models/config-table-ferramentas';
import { OrigemPedido } from '../../../../shared/models';
import { ConfiguracaoColunaDto } from '../../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoColunaUsuarioDto } from '../../../../shared/models/configuracao-coluna-usuario-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../../shared/models/configuracao-filtro-usuario-dto';
import { HistoricoCompraUsuarioDto } from '../../../../shared/models/dto/historico-compra-usuario-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../../../shared/models/paginacao-pesquisa-configurada-dto';
import { HistoricoPedidosFiltroDto } from '../../../../shared/models/pedido/historico-compras-filtro-dto';
import { EnumToArrayPipe } from '../../../../shared/pipes';
import { ArquivoService, TranslationLibraryService } from '../../../../shared/providers';
import { PedidoService } from '../../../../shared/providers/pedido.service';
import { ErrorService } from '../../../../shared/utils/error.service';

@Component({
  selector: 'smk-historico-compras',
  templateUrl: './historico-compras.component.html',
  styleUrls: ['./historico-compras.component.scss'],
})
export class HistoricoComprasComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  readonly textoLimpar: string = 'Limpar';

  configuracaoFerramentasDaTable: ConfigTableFerramentas;
  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  configuracaoDaTable: TableConfig<HistoricoCompraUsuarioDto>;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<HistoricoCompraUsuarioDto>;
  pedidoHistoricoSelecionado: HistoricoCompraUsuarioDto;
  formFiltro: FormGroup;
  filtro: HistoricoPedidosFiltroDto;
  filtroInformado: boolean;
  opcoesOrigem: Array<string>;

  constructor(
    private toastr: ToastrService,
    private pedidoService: PedidoService,
    private translationLibrary: TranslationLibraryService,
    private errorService: ErrorService,
    private arquivoService: ArquivoService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  obterHistorico(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.inicieLoading();

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.pedidoService.filtreHistoricoPedidosUsuario(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (paginacaoPesquisaConfigurada) => {
          this.selecione(null);
          paginacaoPesquisaConfigurada.configuracaoColunasUsuario = new ConfiguracaoColunaUsuarioDto();
          paginacaoPesquisaConfigurada.configuracaoColunasUsuario.colunas = this.colunasDisponiveis;
          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();

          if (emitirToastrDeSucesso) {
            this.emitirToastrDeSucesso();
          }
        },
        (error) => this.errorService.treatError(error));
  }

  selecione(historicoCompras: Array<HistoricoCompraUsuarioDto>): void {
    this.pedidoHistoricoSelecionado = historicoCompras && historicoCompras instanceof Array && historicoCompras.length > 0 ? historicoCompras[0] : undefined;
  }

  visualize(): void {
    if (this.pedidoHistoricoSelecionado) {
      this.router.navigate([`/pedidos`, this.pedidoHistoricoSelecionado.idPedido], { relativeTo: this.route });
    }
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.obterHistorico(false);
  }

  filtre(): void {
    this.obterHistorico(false, true);
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.obterHistorico(false, true);
  }

  populeOrigens(): void {
    const origens = new EnumToArrayPipe().transform(OrigemPedido) as Array<any>;

    this.opcoesOrigem = origens.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  exporte(): void {
    this.inicieLoading();

    this.pedidoService.exporteHistorico(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Histórico de Pedidos.xls`,
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
      descricaoProduto: [null],
      marca: [null],
      razaoSocial: [null],
      origem: [null],
      idOrigem: [null],
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

  private obterHistoricoNaInicializacao(): void {
    this.inicieLoading();

    this.pedidoService.obtenhaFiltroSalvoHistoricoCompra().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: HistoricoPedidosFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.obterHistorico(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  private inicialize(): void {
    this.configureColumns();
    this.construaFormFiltro();
    this.obterHistoricoNaInicializacao();
    this.populeOrigens();
  }

  private configureColumns(): void {
    this.colunasDisponiveis = [
      { coluna: 'Origem', label: 'Origem', tipo: 1 },
      { coluna: 'DescricaoProduto', label: 'Produto', tipo: 1 },
      { coluna: 'Marca', label: 'Marca', tipo: 1 },
      { coluna: 'RazaoSocial', label: 'Fornecedor', tipo: 1 },
      { coluna: 'Quantidade', label: 'Quantidade', tipo: 7 },
      { coluna: 'ValorUnitario', label: 'Valor Unitário', tipo: 8 },
      { coluna: 'ValorTotal', label: 'Valor Total', tipo: 8 }];
  }

  private configureGrid(): void {
    this.configuracaoFerramentasDaTable = new ConfigTableFerramentas({ exibirExportar: true, exibirConfigurarColunas: false });

    this.configuracaoDaTable = new TableConfig<HistoricoCompraUsuarioDto>({
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
    });
  }

  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }
}
