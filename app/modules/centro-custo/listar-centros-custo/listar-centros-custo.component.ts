import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { TranslationLibraryService, CentroCustoService,  } from '@shared/providers';
import { CentroCusto } from '@shared/models';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'app-listar-centros-custo',
  templateUrl: './listar-centros-custo.component.html',
  styleUrls: ['./listar-centros-custo.component.scss']
})
export class ListarCentrosCustoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public centrosCusto: Array<CentroCusto>;
  public centroSelecionado: CentroCusto;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private centroCustoService: CentroCustoService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.obterCentros();
  }

  private obterCentros() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.centroCustoService.listar().subscribe(
      response => {
        if(response) {
          this.construirArvore(response);
        } else {
          this.centrosCusto = new Array<CentroCusto>();
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
    this.centroCustoService.excluir(idCentroCusto).subscribe(resultado => {
      this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      this.blockUI.stop();
      this.tratarExclusao(idCentroCusto);
    }, error => {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    });
  }

  //#region Métodos de árvore
  public state = {}

  private expandedNodeIds = {};
  private hiddenNodeIds = {};

  private construirArvore(centros: Array<CentroCusto>) {
    this.expandedNodeIds = {};
    this.centrosCusto = this.agruparNodes(centros);
    this.state = {
      ...this.state,
      expandedNodeIds: this.expandedNodeIds,
      activeNodeIds: {},      
      hiddenNodeIds: {}
    };
  }

  private agruparNodes(centros: Array<CentroCusto>): Array<any> {
    return centros.map(centro => {
      if(centro.filhos && centro.filhos.length)
        this.expandedNodeIds[centro.idCentroCusto] = true;
      return {
        id: centro.idCentroCusto,
        name: centro.descricao,
        children: centro.filhos && centro.filhos.length ? this.agruparNodes(centro.filhos) : null,
        value: centro
      }
    });
  }

  public selecionarCentro(node: any) {
    this.centroSelecionado = node.node.data.value;
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
