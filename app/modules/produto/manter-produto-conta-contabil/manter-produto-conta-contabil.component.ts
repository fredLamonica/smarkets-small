import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContaContabil, CustomTableSettings, CustomTableColumn, CustomTableColumnType } from '@shared/models';
import { ContaContabilService, TranslationLibraryService, ProdutoService } from '@shared/providers';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'manter-produto-conta-contabil',
  templateUrl: './manter-produto-conta-contabil.component.html',
  styleUrls: ['./manter-produto-conta-contabil.component.scss']
})
export class ManterProdutoContaContabilComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input("id-produto") idProduto: number; 
  @Input("contas-contabeis") contas: Array<ContaContabil>;
  @Output() atualizacao = new EventEmitter();

  public contasDisponiveis: Array<ContaContabil>;
  public contasExclusao: Array<ContaContabil>;
  public contasInclusao: Array<ContaContabil>;

  public settings: CustomTableSettings = new CustomTableSettings(
    [
      new CustomTableColumn("#", "idContaContabil", CustomTableColumnType.text, null, null),
      new CustomTableColumn("Código", "codigo", CustomTableColumnType.text, null, null),
      new CustomTableColumn("Conta contábil", "descricao", CustomTableColumnType.text, null, null)
    ], "check"
  );

  public nodes: Array<any>;

  constructor(    
    private translationLibrary: TranslationLibraryService,
    private contasService: ContaContabilService,
    private produtoService: ProdutoService, 
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

  }

  public obterContas(content?) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contasService.listar().subscribe(
      response => {
        if(response)
          this.contasDisponiveis = response;
        else
          this.contasDisponiveis = new Array<ContaContabil>();
        
        this.prepararArvore();

        if(content)
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

  // #region Inclusão de contas
  public selecionarConta(node) {
    node.data.checked = !node.data.checked;
    if(!this.contasInclusao)
        this.contasInclusao = new Array<ContaContabil>();

    if(node.data.checked) {
      let conta = node.data.value;
      if(conta)
        this.contasInclusao.push(conta);
    } else {
      this.contasInclusao = this.contasInclusao.filter(c => c.idContaContabil != node.data.id);
    }
  }

  public incluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.inserirContas(this.idProduto, this.contasInclusao).subscribe(
      response => {
        this.contas = this.contas.concat(this.contasInclusao);
        this.atualizacao.emit(this.contas);
        this.contasInclusao = new Array<ContaContabil>();
        this.modalService.dismissAll();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  //#endregion

  //#region Deleção de Contas
  public selecaoExclusao(contas: Array<ContaContabil>) {
    this.contasExclusao = contas;
  }

  public solicitarExclusao() {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(), 
      reason => {}
    );
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.produtoService.deletarContas(this.idProduto, this.contasExclusao).subscribe(
      response => {
        let ids = this.contasExclusao.map(c => { return c.idContaContabil });
        this.contas = this.contas.filter(c => !ids.find(i => i == c.idContaContabil));
        this.atualizacao.emit(this.contas);
        this.contasExclusao = new Array<ContaContabil>();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
  // #endregion

  // #region Métodos da árvore
  public expandedNodes: Array<any> = new Array<any>();
  public state = {};

  private prepararArvore() {
    this.nodes = this.construirArvore(this.contasDisponiveis);
    this.contas.forEach(conta => {
      this.findSelectedNode(this.nodes, conta.idContaContabil);
    });

    this.state = {
      ...this.state,
      expandedNodeIds: this.expandedNodes
    };
  }

  private construirArvore(contas: Array<ContaContabil>) {
    return contas.map(conta => {
      return {
        id: conta.idContaContabil,
        checked: false,
        disabled: false,
        name: conta.descricao,
        children: conta.filhos && conta.filhos.length ? this.construirArvore(conta.filhos) : null,
        isExpanded: false,
        value: conta
      }
    });
  }

  private findSelectedNode(nodes, id): any {
    if(nodes) {
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