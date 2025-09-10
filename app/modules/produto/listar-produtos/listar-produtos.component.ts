import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Ordenacao, Produto, SituacaoProduto } from '@shared/models';
import { AutenticacaoService, ProdutoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { SituacaoProdutoIA } from '../../../shared/models/enums/situacao-produto-ia';
import { TipoIA } from '../../../shared/models/enums/tipo-ia';
import { ProdutoFiltro } from '../../../shared/models/fltros/produto-filtro';
import { EnumToArrayPipe } from '../../../shared/pipes';

@Component({
  selector: 'app-listar-produtos',
  templateUrl: './listar-produtos.component.html',
  styleUrls: ['./listar-produtos.component.scss'],
})
export class ListarProdutosComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  buscaAvancada: boolean = false;
  form: FormGroup;

  SituacaoProduto = SituacaoProduto;
  produtoFiltro: ProdutoFiltro = new ProdutoFiltro();
  produtos: Array<Produto>;
  termo: string = '' ;
  settings: CustomTableSettings;
  tipoIA = TipoIA;

  selecionados: Array<Produto>;

  registrosPorPagina: number = 5;
  pagina: number = 1;
  totalPaginas: number = 0;
  ordenarPor: string = 'idProduto';
  ordenacao: Ordenacao = Ordenacao.DESC;
  isSmarkets: boolean = false;
  opcoesSituacaoIA: Array<{ index: number, name: string }>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private produtoService: ProdutoService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private authService: AutenticacaoService
  ) {
    super();
  }

  ngOnInit() {
    this.isSmarkets = this.authService.usuario().permissaoAtual.isSmarkets;
    this.configurarTabela();
    this.populeSituacoes();
    this.construirFormulario();
    this.obterProdutos();
  }

  construirFormulario() {
    this.form = this.fb.group({
      termo: [''],
      codigo: [''],
      situacaoIA: [''],
    });
  }

  buscar(termo) {
    this.termo = termo;
    this.pagina = 1;
    this.obterProdutos();
  }

  campoBuscaChanged() {
    const termo: string = this.form.value.termo;
    if (termo == null || termo.length === 0) {
      this.buscar('');
    }
  }

  private populeSituacoes(): void {
    let situacoes = new EnumToArrayPipe().transform(SituacaoProdutoIA) as Array<any>;

    if (situacoes) {
      this.opcoesSituacaoIA = situacoes.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
    }
  }

  selecao(produtos: Array<Produto>) {
    this.selecionados = produtos;
  }

  solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      (result) => this.excluir(),
      (reason) => { },
    );
  }

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  exibirBuscaAvancada(event) {
    if(event)
      this.buscaAvancada = true;
    else
      this.buscaAvancada = false;
  }

  // CALLBACK de paginacao
  paginacao(event) {
    this.pagina = event.page;
    this.registrosPorPagina = event.recordsPerPage;
    this.obterProdutos();
  }

  // CALLBACK de ordenação
  ordenar(sorting) {
    this.ordenacao = sorting.order;
    this.ordenarPor = sorting.sortBy;
    this.obterProdutos();
  }

  alterarSituacao(situacao: SituacaoProduto) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.produtoService.alterarSituacao(situacao, this.selecionados).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterProdutos();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        });
  }

  get permiteEnviarIA(){
    if(!this.selecionados.length)
      return false;

    if(this.selecionados.filter(x => x.situacaoIA != SituacaoProdutoIA['Sem interação']).length)
      return false;

    return true;
  }

  priorizarEnvioIA(tipoIA: TipoIA) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.produtoService.priorizarEnvioIA(this.selecionados.map(x => x.idProduto), tipoIA).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterProdutos();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
    });
  }

  private configurarTabela() {

    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('#', 'idProduto', CustomTableColumnType.text, null, null, null, 'idProduto'),
        new CustomTableColumn('Código', 'codigo', CustomTableColumnType.text, null, null, null, 'codigo'),
        new CustomTableColumn('Produto', 'descricao', CustomTableColumnType.text, null, null, null, 'descricao'),
        new CustomTableColumn('Categoria', 'categoria.nome', CustomTableColumnType.text, null, null, null, 'categoria'),
        new CustomTableColumn('Consumo médio', 'consumoMedio', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR', null, 'consumoMedio'),
        new CustomTableColumn('Unidade de medida', 'unidadeMedida.sigla', CustomTableColumnType.text, null, null, null, 'unidadeMedida'),
        new CustomTableColumn('Situação', 'situacao', CustomTableColumnType.enum, null, null, SituacaoProduto),
      ], 'check', this.ordenarPor, this.ordenacao,
    );

    if(this.isSmarkets)
      this.settings.columns.splice(6, 0, new CustomTableColumn('Status I.A', 'situacaoIA', CustomTableColumnType.enum, null, null, SituacaoProdutoIA, 'SituacaoIA'))
  }

  filtroAvancado(){
    this.produtoFiltro.filtroAvancado = true;
    this.obterProdutos(0, this.form.controls.codigo.value, 0, this.form.controls.termo.value)
  }

  private obterProdutos(idCategoria: number = 0, codigo: string = '', situacao = 0, descricao: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.produtoFiltro.itensPorPagina = this.registrosPorPagina;
    this.produtoFiltro.pagina = this.pagina;
    this.produtoFiltro.itemOrdenar = this.ordenarPor;
    this.produtoFiltro.ordenacao = this.ordenacao;
    this.produtoFiltro.idCategoria = idCategoria;
    this.produtoFiltro.descricao = descricao == '' ? encodeURIComponent(this.termo) : encodeURIComponent(descricao);
    this.produtoFiltro.codigo = codigo == '' ? this.form.controls.codigo.value : codigo;
    this.produtoFiltro.situacao = situacao;
    this.produtoFiltro.situacaoIA = this.form.controls.situacaoIA.value;

    this.produtoService.filtrar(this.produtoFiltro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.selecionados = []))
      .subscribe(
        (response) => {
          if (response) {
            this.produtos = response.itens;
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.produtos = new Array<Produto>();
            this.totalPaginas = 1;
          }

          this.blockUI.stop();
        }, (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.produtoService.excluirBatch(this.selecionados).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.pagina = 1;
          this.obterProdutos();
        }, (responseError) => {
          if (responseError.error) {
            this.toastr.error(responseError.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }

          this.blockUI.stop();
        });
  }
}
