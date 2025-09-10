import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { TranslationLibraryService, ContaContabilService,  } from '@shared/providers';
import { ContaContabil } from '@shared/models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'app-listar-contas-contabeis',
  templateUrl: './listar-contas-contabeis.component.html',
  styleUrls: ['./listar-contas-contabeis.component.scss']
})
export class ListarContasContabeisComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public contas: Array<ContaContabil>;
  public contaSelecionada: ContaContabil;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contaService: ContaContabilService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.obterContas();
  }

  private obterContas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contaService.listar().subscribe(
      response => {
        if(response) {
          this.construirArvore(response);
        } else {
          this.contas = new Array<ContaContabil>();
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public solicitarExclusao(idContaContabil: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(idContaContabil), 
      reason => {}
    );
  }

  private excluir(idContaContabil: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contaService.excluir(idContaContabil).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.tratarExclusao(idContaContabil);
    }, error => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }

  //#region Métodos de árvore
  public state = {}

  private expandedNodeIds = {};
  private hiddenNodeIds = {};

  private construirArvore(contas: Array<ContaContabil>) {
    this.expandedNodeIds = {};
    this.contas = this.agruparNodes(contas);
    this.state = {
      ...this.state,
      expandedNodeIds: this.expandedNodeIds,
      activeNodeIds: {},      
      hiddenNodeIds: {}
    };
  }

  private agruparNodes(contas: Array<ContaContabil>): Array<any> {
    return contas.map(conta => {
      if(conta.filhos && conta.filhos.length)
        this.expandedNodeIds[conta.idContaContabil] = true;
      return {
        id: conta.idContaContabil,
        name: conta.descricao,
        children: conta.filhos && conta.filhos.length ? this.agruparNodes(conta.filhos) : null,
        value: conta
      }
    });
  }

  public selecionarConta(node: any) {
    this.contaSelecionada = node.node.data.value;
  }

  private tratarExclusao(idConta) {
    //esconde o excluido
    this.hiddenNodeIds[idConta] = true;
    this.state = {
      ...this.state,
      expandedNodeIds: this.state["expandedNodeIds"],
      activeNodeIds: {},
      hiddenNodeIds: this.hiddenNodeIds
    };
  }
  //#endregion
}
