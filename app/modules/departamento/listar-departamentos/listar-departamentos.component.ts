import { Component, OnInit } from '@angular/core';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Departamento } from '@shared/models';
import { DepartamentoService, TranslationLibraryService, } from '@shared/providers';
import { takeUntil } from 'rxjs/operators';
import { ErrorService } from '../../../shared/utils/error.service';

@Component({
  selector: 'app-listar-departamentos',
  templateUrl: './listar-departamentos.component.html',
  styleUrls: ['./listar-departamentos.component.scss']
})
export class ListarDepartamentosComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public departamentos: Array<Departamento>;
  public departamentoSelecionado: Departamento;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private departamentoService: DepartamentoService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal,
    private errorService: ErrorService,
  )
  {
    super()
  }

  ngOnInit() {
    this.obterDepartamentos();
  }

  private obterDepartamentos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.listar().subscribe(
      response => {
        if(response) {
          this.construirArvore(response);
        } else {
          this.departamentos = new Array<Departamento>();
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public solicitarExclusao(idCentroCusto: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(idCentroCusto),
      reason => {}
    );
  }

  private excluir(idCentroCusto: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.departamentoService.deletar(idCentroCusto)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          if(resultado){
           this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
           this.tratarExclusao(idCentroCusto);
          }
          this.blockUI.stop();

        }, (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
        });
  }

  //#region Métodos de árvore

  public state = {}

  private expandedNodeIds = {};
  private hiddenNodeIds = {};

  private construirArvore(departamentos: Array<Departamento>) {
    this.expandedNodeIds = {};
    this.departamentos = this.agruparNodes(departamentos);
    this.state = {
      ...this.state,
      expandedNodeIds: this.expandedNodeIds,
      activeNodeIds: {},
      hiddenNodeIds: {}
    };
  }

  private agruparNodes(departamentos: Array<Departamento>): Array<any> {
    return departamentos.map(departamento => {
      if(departamento.filhos && departamento.filhos.length)
        this.expandedNodeIds[departamento.idDepartamento] = true;
      return {
        id: departamento.idDepartamento,
        name: departamento.descricao,
        children: departamento.filhos && departamento.filhos.length ? this.agruparNodes(departamento.filhos) : null,
        value: departamento
      }
    });
  }

  public selecionarDepartamento(node: any) {
    this.departamentoSelecionado = node.node.data.value;
  }

  private tratarExclusao(idCentroCusto) {
    //esconde o excluido
    this.hiddenNodeIds[idCentroCusto] = true;
    this.state = {
      ...this.state,
      expandedNodeIds: this.state["expandedNodeIds"],
      activeNodeIds: {},
      hiddenNodeIds: this.hiddenNodeIds
    };
  }

  //#endregion

}
