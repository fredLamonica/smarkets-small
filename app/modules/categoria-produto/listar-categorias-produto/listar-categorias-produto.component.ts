import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { TranslationLibraryService, CategoriaProdutoService,  } from '@shared/providers';
import { CategoriaProduto } from '@shared/models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';


@Component({
  selector: 'app-listar-categorias-produto',
  templateUrl: './listar-categorias-produto.component.html',
  styleUrls: ['./listar-categorias-produto.component.scss']
})
export class ListarCategoriasProdutoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public categorias: Array<CategoriaProduto>;
  public categoriaSelecionada: CategoriaProduto;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private categoriaService: CategoriaProdutoService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.obterCategorias();
  }

  private obterCategorias() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaService.listar().subscribe(
      response => {
        if(response) {
          this.construirArvore(response);
        } else {
          this.categorias = new Array<CategoriaProduto>();
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public solicitarExclusao(idCategoria: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true, backdrop: 'static'}).result.then(
      result => this.excluir(idCategoria),
      reason => {}
    );
  }

  private excluir(idCategoria: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.categoriaService.excluir(idCategoria).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.tratarExclusao(idCategoria);
    }, responseError => {
      this.toastr.error(responseError.error);
      this.blockUI.stop();
    });
  }

  //#region Métodos de árvore
  public state = {}

  private expandedNodeIds = {};
  private hiddenNodeIds = {};

  private construirArvore(categorias: Array<CategoriaProduto>) {
    this.expandedNodeIds = {};
    this.categorias = this.agruparNodes(categorias);
    this.state = {
      ...this.state,
      expandedNodeIds: this.expandedNodeIds,
      activeNodeIds: {},
      hiddenNodeIds: {}
    };
  }

  private agruparNodes(categorias: Array<CategoriaProduto>): Array<any> {
    return categorias.map(categoria => {
      if(categoria.filhos && categoria.filhos.length)
        this.expandedNodeIds[categoria.idCategoriaProduto] = true;
      return {
        id: categoria.idCategoriaProduto,
        name: categoria.nome,
        children: categoria.filhos && categoria.filhos.length ? this.agruparNodes(categoria.filhos) : null,
        value: categoria
      }
    });
  }

  public selecionarCategoria(node: any) {
    this.categoriaSelecionada = node.node.data.value;
  }

  private tratarExclusao(idCategoria) {
    //esconde o excluido
    this.hiddenNodeIds[idCategoria] = true;
    this.state = {
      ...this.state,
      expandedNodeIds: this.state["expandedNodeIds"],
      activeNodeIds: {},
      hiddenNodeIds: this.hiddenNodeIds
    };
  }
  //#endregion
}
