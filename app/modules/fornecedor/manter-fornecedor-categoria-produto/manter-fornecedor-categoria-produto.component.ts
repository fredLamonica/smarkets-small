import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CategoriaProduto, CustomTableSettings, CustomTableColumn, CustomTableColumnType } from '@shared/models';
import { TranslationLibraryService, CategoriaProdutoService, FornecedorService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'manter-fornecedor-categoria-produto',
  templateUrl: './manter-fornecedor-categoria-produto.component.html',
  styleUrls: ['./manter-fornecedor-categoria-produto.component.scss']
})
export class ManterFornecedorCategoriaProdutoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input("id-pessoa") idPessoa: number;
  public categorias: Array<CategoriaProduto>;
  @Output() atualizacao = new EventEmitter();

  public categoriasDisponiveis: Array<CategoriaProduto>;
  public categoriasExclusao: Array<CategoriaProduto>;
  public categoriasInclusao: Array<CategoriaProduto>;

  public settings: CustomTableSettings = new CustomTableSettings(
    [
      new CustomTableColumn("#", "idCategoriaProduto", CustomTableColumnType.text, null, null),
      new CustomTableColumn("Código", "codigo", CustomTableColumnType.text, null, null),
      new CustomTableColumn("Categoria", "nome", CustomTableColumnType.text, null, null)
    ], "check"
  );

  public nodes: Array<any>;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private categoriaService: CategoriaProdutoService,
    private fornecedorService: FornecedorService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    if (this.idPessoa) {
      this.obterCategoriasFornecedor();
    } else {
      this.categorias = new Array<CategoriaProduto>();
    }
  }

  public obterCategoriasFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.obterCategorias(this.idPessoa).subscribe(
      response => {
        if (response)
          this.categorias = response;
        else
          this.categorias = new Array<CategoriaProduto>();
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public obterCategorias(content?) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaService.listar().subscribe(
      response => {
        if (response)
          this.categoriasDisponiveis = response;
        else
          this.categoriasDisponiveis = new Array<CategoriaProduto>();

        this.prepararArvore();

        if (content)
          this.abrirModal(content);

        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private abrirModal(content) {
    let modal = this.modalService.open(content, { size: 'lg', centered: true });
  }

  // #region Inclusão de categorias
  public selecionarCategoria(node) {
    node.data.checked = !node.data.checked;
    if (!this.categoriasInclusao)
      this.categoriasInclusao = new Array<CategoriaProduto>();

    if (node.data.checked) {
      let categoria = node.data.value;
      if (categoria)
        this.categoriasInclusao.push(categoria);
    } else {
      this.categoriasInclusao = this.categoriasInclusao.filter(c => c.idCategoriaProduto != node.data.id);
    }
  }

  public incluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (this.idPessoa) {
      this.fornecedorService.inserirCategorias(this.idPessoa, this.categoriasInclusao).subscribe(
        response => {
          this.categorias = this.categorias.concat(this.categoriasInclusao);
          this.atualizacao.emit(this.categorias);
          this.categoriasInclusao = new Array<CategoriaProduto>();
          this.modalService.dismissAll();
          this.blockUI.stop();
        }, error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      this.categorias = this.categorias.concat(this.categoriasInclusao);
      this.atualizacao.emit(this.categorias);
      this.categoriasInclusao = new Array<CategoriaProduto>();
      this.modalService.dismissAll();
      this.blockUI.stop();
    }
  }
  //#endregion

  //#region Deleção de Categorias
  public selecaoExclusao(categorias: Array<CategoriaProduto>) {
    this.categoriasExclusao = categorias;
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(),
      reason => { }
    );
  }

  private excluir() {
    if (this.idPessoa) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.fornecedorService.deletarCategorias(this.idPessoa, this.categoriasExclusao).subscribe(
        response => {
          let ids = this.categoriasExclusao.map(c => { return c.idCategoriaProduto });
          this.categorias = this.categorias.filter(c => !ids.find(i => i == c.idCategoriaProduto));
          this.atualizacao.emit(this.categorias);
          this.categoriasExclusao = new Array<CategoriaProduto>();
          this.blockUI.stop();
        }, error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    } else {
      let ids = this.categoriasExclusao.map(c => { return c.idCategoriaProduto });
      this.categorias = this.categorias.filter(c => !ids.find(i => i == c.idCategoriaProduto));
      this.atualizacao.emit(this.categorias);
      this.categoriasExclusao = new Array<CategoriaProduto>();
      this.blockUI.stop();
    }
  }
  // #endregion

  // #region Métodos da árvore
  public expandedNodes: Array<any> = new Array<any>();
  public state = {};

  private prepararArvore() {
    this.nodes = this.construirArvore(this.categoriasDisponiveis);
    this.categorias.forEach(categoria => {
      this.findSelectedNode(this.nodes, categoria.idCategoriaProduto);
    });

    this.state = {
      ...this.state,
      expandedNodeIds: this.expandedNodes
    };
  }

  private construirArvore(categorias: Array<CategoriaProduto>) {
    return categorias.map(categoria => {
      return {
        id: categoria.idCategoriaProduto,
        checked: false,
        disabled: false,
        name: categoria.nome,
        children: categoria.filhos && categoria.filhos.length ? this.construirArvore(categoria.filhos) : null,
        isExpanded: false,
        value: categoria
      }
    });
  }

  private findSelectedNode(nodes, id): any {
    if (nodes) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id == id) {
          nodes[i].checked = true;
          nodes[i].disabled = true;
          return nodes[i];
        }
        var found = this.findSelectedNode(nodes[i].children, id);
        if (found) {
          this.expandedNodes[nodes[i].id] = true;
          return found;
        }
      }
    }
  }
  // #endregion
}