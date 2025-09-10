import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalConfirmacaoExclusao } from '../../../../shared/components';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { TableConfig } from '../../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../../shared/components/data-list/table/models/table-pagination';
import { Usuario } from '../../../../shared/models';
import { ConfiguracaoColunaDto } from '../../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../../shared/models/configuracao-filtro-usuario-dto';
import { ProdutoFavoritoDto } from '../../../../shared/models/dto/produto-favorito-dto';
import { ProdutoFavoritoFiltroDto } from '../../../../shared/models/dto/produto-favorito-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../../../shared/models/paginacao-pesquisa-configurada-dto';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '../../../../shared/providers';
import { ProdutoFavoritoService } from '../../../../shared/providers/produto-favorito.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { DetalhesProdutoComponent } from '../../../catalogo/detalhes-produto/detalhes-produto.component';

@Component({
  selector: 'smk-produtos-favoritos',
  templateUrl: './produtos-favoritos.component.html',
  styleUrls: ['./produtos-favoritos.component.scss'],
})
export class ProdutosFavoritosComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<ProdutoFavoritoDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  filtro: ProdutoFavoritoFiltroDto;
  formFiltro: FormGroup;
  filtroInformado: boolean;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<ProdutoFavoritoDto>;
  itemSelecionado: ProdutoFavoritoDto;
  produtosFavoritos: Array<ProdutoFavoritoDto>;
  usuariosLoading: boolean;
  usuarioLogado: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private autenticacaoService: AutenticacaoService,
    private arquivoService: ArquivoService,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private modalService: NgbModal,
    private produtoFavoritoService: ProdutoFavoritoService,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    this.inicialize();
  }

  visualizeItem() {
    const modalRef = this.modalService.open(DetalhesProdutoComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idContratoCatalogoItem = this.itemSelecionado.idContratoCatalogoItem;
    modalRef.componentInstance.idProduto = this.itemSelecionado.idProduto;
    modalRef.componentInstance.ocultarBtnAdicionarCarrinho = true;
    modalRef.result.then(() => { }, () => { });
  }

  comprarItem(): void {
    this.router.navigate(['/marketplace']);
  }

  solicitarExclusao(idProdutoFavorito: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true, backdrop: 'static' }).result.then(
      (result) => this.excluir(idProdutoFavorito),
      (reason) => { },
    );
  }

  excluir(idProdutoFavorito: number): void {
    this.blockUI.start();

    this.produtoFavoritoService.excluir(idProdutoFavorito).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (linhasAlteradas) => {
          if (linhasAlteradas && linhasAlteradas > 0) {
            this.filtreProdutosFavoritos(true);
          }
        },
        (error) => {
          this.toastr.error(error);
          this.blockUI.stop();
        });
  }

  exporte(): void {
    this.inicieLoading();

    this.produtoFavoritoService.exportarRelatorio(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(response, `Relatório de Produtos Favoritos.xls`);
          this.emitirToastrDeSucesso();
        },
        (error) => this.errorService.treatError(error));
  }

  selecione(produtosFavoritos: Array<ProdutoFavoritoDto>): void {
    this.itemSelecionado = produtosFavoritos && produtosFavoritos instanceof Array && produtosFavoritos.length > 0 ? produtosFavoritos[0] : undefined;
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtreProdutosFavoritos(false);
  }

  filtreProdutosFavoritos(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    this.inicieLoading();

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.produtoFavoritoService.filtre(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (paginacaoPesquisaConfigurada) => {
          this.selecione(null);

          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();

          if (emitirToastrDeSucesso) {
            this.emitirToastrDeSucesso();
          }
        },
        (error) => this.errorService.treatError(error));
  }

  filtre(): void {
    this.filtreProdutosFavoritos(false, true);
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.filtreProdutosFavoritos(false, true);
  }

  private inicialize(): void {
    this.usuarioLogado = this.autenticacaoService.usuario();

    this.construaFormFiltro();
    this.obtenhaColunasDisponiveis();
    this.filtreProdutosFavoritosNaInicializacao();
  }

  private construaFormFiltro(): void {
    this.formFiltro = this.fb.group({
      descricao: [null],
      marca: [null],
      fornecedor: [null],
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
    this.produtoFavoritoService.obtenhaColunasDiponiveis().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private filtreProdutosFavoritosNaInicializacao(): void {
    this.inicieLoading();

    this.produtoFavoritoService.obtenhaFiltroSalvo().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: ProdutoFavoritoFiltroDto) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formFiltro.patchValue(this.filtro);
          this.filtreProdutosFavoritos(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private configureGrid(): void {
    this.configuracaoDaTable = new TableConfig<ProdutoFavoritoDto>({
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
    });
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

}
