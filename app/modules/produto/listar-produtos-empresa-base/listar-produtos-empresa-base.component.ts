import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { Ordenacao, SituacaoProduto } from '@shared/models';
import { ProdutoEmpresaBase } from '@shared/models/produto-empresa-base';
import { ProdutoEmpresaBaseFiltro } from '@shared/models/produto-empresa-base-filtro';
import { AutenticacaoService, CategoriaProdutoService, ProdutoService, TranslationLibraryService, UnidadeMedidaService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { ClonarProdutosEmpresaBaseComponent } from './clonar-produtos-empresa-base/clonar-produtos-empresa-base.component';

@Component({
  selector: 'app-listar-produtos-empresa-base',
  templateUrl: './listar-produtos-empresa-base.component.html',
  styleUrls: ['./listar-produtos-empresa-base.component.scss'],
})
export class ListarProdutosEmpresaBaseComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  produtos: Array<ProdutoEmpresaBase>;
  filtro: ProdutoEmpresaBaseFiltro;
  selecaoHabilitada: boolean = true;
  filtroExpandido: boolean;
  empresaBaseEhHolding: boolean;
  situacoes: Array<any>;
  categorias: Array<any>;
  unidadesDeMedida: Array<any>;

  get selecionarTodos(): boolean {
    return this._selecionarTodos;
  }

  set selecionarTodos(value: boolean) {
    this.selecione(value);
    this._selecionarTodos = value;
  }

  private _selecionarTodos: boolean = false;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private produtoService: ProdutoService,
    private authService: AutenticacaoService,
    private categoriaService: CategoriaProdutoService,
    private unidadeDeMedidaService: UnidadeMedidaService,
    private modalService: NgbModal,
    private errorService: ErrorService,
  ) {
    super();
  }

  ngOnInit() {
    this.definaTipoDaEmpresaBase();
    this.construaFiltro();
    this.populeListas();
    this.getProdutos();
  }

  habilitarDesabilitarSelecao() {
    if (this.selecaoHabilitada) {
      this.selecione(false);
      this.selecionarTodos = false;
    }

    this.selecaoHabilitada = !this.selecaoHabilitada;
  }

  selecioneOsAtivos() {
    for (const produto of this.produtos.filter((p) => p.situacao === SituacaoProduto.Ativo)) {
      produto.selected = true;
    }

    this._selecionarTodos = true;
  }

  getProdutos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.produtoService.filtreProdutosDaEmpresaBase(this.filtro).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.produtos = response.itens.map((x) => new ProdutoEmpresaBase({
              idProduto: x.idProduto,
              idTenant: x.idTenant,
              idCategoriaProduto: x.idCategoriaProduto,
              categoria: x.categoria,
              idUnidadeMedida: x.idUnidadeMedida,
              unidadeMedida: x.unidadeMedida,
              situacao: x.situacao,
              tipo: x.tipo,
              codigo: x.codigo,
              descricao: x.descricao,
              descricaoDetalhada: x.descricaoDetalhada,
            }));

            this.filtro.totalDePaginas = response.numeroPaginas;
          } else {
            this.filtro.pagina = 1;
            this.filtro.totalDePaginas = 0;
            this.produtos = new Array<ProdutoEmpresaBase>();
          }

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  clone(): void {
    if (this.temAlgumSelecionado()) {
      const modalRef = this.modalService.open(ClonarProdutosEmpresaBaseComponent, { windowClass: 'modal-xl', centered: true, backdrop: 'static', keyboard: false });

      modalRef.componentInstance.produtos = this.produtos.filter((x) => x.selected);
      modalRef.result.then((produtosIncluidosNaClonagem) => {
        if (produtosIncluidosNaClonagem && produtosIncluidosNaClonagem instanceof Array && produtosIncluidosNaClonagem.length > 0) {
          this.blockUI.start(this.translationLibrary.translations.LOADING);

          this.produtoService.cloneProdutosDaEmpresaBase(produtosIncluidosNaClonagem).pipe(
            takeUntil(this.unsubscribe),
            finalize(() => this.blockUI.stop()))
            .subscribe(
              () => {
                this.getProdutos();
                this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              },
              (error) => this.errorService.treatError(error));
        }
      });
    }
  }

  todosEstaoSelecionados(): boolean {
    return this.produtos ? this.produtos.every((p) => p.selected) : false;
  }

  getSelecionados(): Array<ProdutoEmpresaBase> {
    return this.produtos ? this.produtos.filter((p) => p.selected) : new Array<ProdutoEmpresaBase>();
  }

  temAlgumSelecionado(): boolean {
    return this.produtos ? this.produtos.some((p) => p.selected) : false;
  }

  pagine(event: any) {
    this.filtro.pagina = event.page;
    this.filtro.itensPorPagina = event.recordsPerPage;

    this.getProdutos();
  }

  selecioneTodos() {
    this._selecionarTodos = this.todosEstaoSelecionados();
  }

  definaFiltroDeSituacao(dadosSituacao: any) {
    if (dadosSituacao && !(dadosSituacao instanceof Array)) {
      this.filtro.situacao = dadosSituacao.id;
    } else {
      delete this.filtro.situacao;
    }
  }

  definaFiltroDeCategoria(dadosCategoria: any) {
    if (dadosCategoria && !(dadosCategoria instanceof Array)) {
      this.filtro.idCategoriaProduto = dadosCategoria.id;
    } else {
      delete this.filtro.idCategoriaProduto;
    }
  }

  definaFiltroDeUnidadeDeMedida(dadosUnidadeDeMedida: any) {
    if (dadosUnidadeDeMedida && !(dadosUnidadeDeMedida instanceof Array)) {
      this.filtro.idUnidadeMedida = dadosUnidadeDeMedida.id;
    } else {
      delete this.filtro.idUnidadeMedida;
    }
  }

  private construaFiltro(): void {
    this.filtro = new ProdutoEmpresaBaseFiltro({
      itensPorPagina: 5,
      pagina: 1,
      ordenarPor: 'idProduto',
      ordenacao: Ordenacao.DESC,
    });
  }

  private definaTipoDaEmpresaBase() {
    const usuario = this.authService.usuario();

    if (!usuario.permissaoAtual.isSmarkets) {
      if (!usuario.permissaoAtual.pessoaJuridica.holding && usuario.permissaoAtual.pessoaJuridica.idPessoaJuridicaHoldingPai) {
        this.empresaBaseEhHolding = true;
      }
    }
  }

  private populeListas() {
    this.situacoes = [
      { id: SituacaoProduto.Ativo, label: SituacaoProduto[SituacaoProduto.Ativo] },
      { id: SituacaoProduto.Inativo, label: SituacaoProduto[SituacaoProduto.Inativo] },
      { id: SituacaoProduto.Solicitação, label: SituacaoProduto[SituacaoProduto.Solicitação] },
    ];

    this.categoriaService.listarAtivasDaEmpresaBaseSemHierarquia().pipe(
      takeUntil(this.unsubscribe))
      .subscribe((categorias) => {
        if (categorias) {
          this.categorias = categorias.map((x) => ({ id: x.idCategoriaProduto, label: x.nome }));
        }
      });

    this.unidadeDeMedidaService.listarDaEmpresaBase().pipe(
      takeUntil(this.unsubscribe))
      .subscribe((unidadesDeMedida) => {
        if (unidadesDeMedida) {
          this.unidadesDeMedida = unidadesDeMedida.map((x) => ({ id: x.idUnidadeMedida, label: `${x.descricao}${x.sigla ? ` - ${x.sigla}` : ''}` }));
        }
      });
  }

  private selecione(selecionar: boolean) {
    this.produtos.forEach((value) => (value.selected = selecionar));
  }

}
