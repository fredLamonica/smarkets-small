import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CategoriaProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../shared/components/data-list/table/models/table-pagination';
import { CategoriaProdutoSellerDto } from '../../../shared/models/categoria-produto-seller-dto';
import { CategoriaProdutoSellerFiltroDto } from '../../../shared/models/categoria-produto-seller-filtro-dto';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../shared/models/configuracao-filtro-usuario-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../../shared/models/paginacao-pesquisa-configurada-dto';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'smk-liste-categorias',
  templateUrl: './liste-categorias.component.html',
  styleUrls: ['./liste-categorias.component.scss']
})
export class ListeCategoriasComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  readonly textoLimpar: string = 'Limpar';

  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<CategoriaProdutoSellerDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  filtro: CategoriaProdutoSellerFiltroDto;
  formFiltro: FormGroup;
  filtroInformado: boolean;
  habilitarIntegracaoSistemaChamado: boolean;
  opcoesSituacao: Array<{ index: number, name: string }>;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<CategoriaProdutoSellerDto>;
  categoriaSelecionado: CategoriaProdutoSellerDto;
  categorias: Array<CategoriaProdutoSellerDto>;

  mascaraSomenteNumeros = {
    mask: [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/],
    guide: false,
  };

  constructor(
    private errorService: ErrorService,
    private fb: FormBuilder,
    private categoriaProdutoService: CategoriaProdutoService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
  ) {
    super();
  }

  ngOnInit() {
    this.construaFormFiltro();
    this.obtenhaColunasDisponiveis();
    this.filtreCategoriasNaInicializacao();
  }

  filtreCategorias(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.inicieLoading();

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.categoriaProdutoService.filtre(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (paginacaoPesquisaConfigurada) => {
          // Limpando a requisição selecionada.
          this.selecione(null);
          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();

          if (emitirToastrDeSucesso) {
            this.emitirToastrDeSucesso();
          }
        },
        (error) => this.errorService.treatError(error));
  }

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  origensSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  selecione(pedidos: Array<CategoriaProdutoSellerDto>): void {
    this.categoriaSelecionado = pedidos && pedidos instanceof Array && pedidos.length > 0 ? pedidos[0] : undefined;
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.filtreCategorias(false, true);
  }

  filtre(): void {
    this.filtreCategorias(false, true);
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtreCategorias(false);
  }

  private configureGrid(): void {
    this.configuracaoDaTable = new TableConfig<CategoriaProdutoSellerDto>({
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
    });
  }


  private construaFormFiltro(): void {
    this.formFiltro = this.fb.group({
      idCategoriaProduto: [null],
      descricao: [null],

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

  private obtenhaColunasDisponiveis(): void {
    this.categoriaProdutoService.obtenhaColunasDiponiveis().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private filtreCategoriasNaInicializacao(): void {
    this.inicieLoading();

    this.categoriaProdutoService.obtenhaFiltroSalvo().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: CategoriaProdutoSellerFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.filtreCategorias(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }
  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

}
