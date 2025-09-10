import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

import { TranslationLibraryService, UnidadeMedidaService } from '@shared/providers';
import { UnidadeMedida, CustomTableSettings, CustomTableColumn, CustomTableColumnType, Ordenacao } from '@shared/models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ManterUnidadeMedidaComponent } from './../../unidade-medida/manter-unidade-medida/manter-unidade-medida.component';

@Component({
  selector: 'app-listar-unidades-medida',
  templateUrl: './listar-unidades-medida.component.html',
  styleUrls: ['./listar-unidades-medida.component.scss']
})
export class ListarUnidadesMedidaComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public unidades: Array<UnidadeMedida>;

  private termo: string = "";
  public registrosPorPagina: number = 16;
  public pagina: number = 1;
  public totalPaginas: number = 0;
  public ordenarPor: string = "idUnidadeMedida";
  public ordenacao: Ordenacao = Ordenacao.DESC;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private unidadeService: UnidadeMedidaService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.resetPaginacao();
    this.obterUnidades();
  }

  public buscar(termo: string){
    this.termo = termo;
    this.resetPaginacao();
    this.obterUnidades();
  }
  
  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterUnidades();
    }
  }

  public resetPaginacao() {
    this.unidades = new Array<UnidadeMedida>();
    this.pagina = 1;
  }

  private obterUnidades() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.unidadeService.filtrar(this.registrosPorPagina, this.pagina, this.ordenarPor, this.ordenacao, this.termo).subscribe(
      response => {
        if (response){
          this.unidades = this.unidades.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.unidades = new Array<UnidadeMedida>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  // #region Ações

  public solicitarExclusao(idUnidadeMedida: number) {
    const modalRef = this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => this.excluir(idUnidadeMedida), 
      reason => {}
    );
  }

  private excluir(idUnidadeMedida: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.unidadeService.excluir(idUnidadeMedida).subscribe(
      response => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
        this.resetPaginacao();
        this.obterUnidades();
      }, error => {
        this.toastr.error(error.error);
        this.blockUI.stop();
      }
    );
  }

  public auditar(idUnidadeMedida: number){
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: "lg" });
    modalRef.componentInstance.nomeClasse = "UnidadeMedida";
    modalRef.componentInstance.idEntidade = idUnidadeMedida;
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterUnidadeMedidaComponent, { centered: true, size: 'lg' }).result.then(
      result => {
        this.resetPaginacao();
        this.obterUnidades();
      }
    );
  }

  public editar(idUnidadeMedida: number) {
    const modalRef = this.modalService.open(ManterUnidadeMedidaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idUnidade = idUnidadeMedida;
    modalRef.result.then(
      result => {
        this.resetPaginacao();
        this.obterUnidades();
      }
    );
  }

  // #endregion
}
