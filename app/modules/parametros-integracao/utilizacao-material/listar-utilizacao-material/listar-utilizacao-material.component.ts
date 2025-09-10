import { Component, OnInit } from '@angular/core';
import { UtilizacaoMaterial } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { UtilizacaoMaterialService, TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { ManterUtilizacaoMaterialComponent } from '../manter-utilizacao-material/manter-utilizacao-material.component';

@Component({
  selector: 'listar-utilizacao-material',
  templateUrl: './listar-utilizacao-material.component.html',
  styleUrls: ['./listar-utilizacao-material.component.scss']
})
export class ListarUtilizacaoMaterialComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;
  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdUtilizacaoMaterial';
  private termo: string = '';

  public utilizacoesMateriais: Array<UtilizacaoMaterial> = new Array<UtilizacaoMaterial>();

  constructor(
    private utilizacaoMaterialService: UtilizacaoMaterialService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterOrigensMateriais();
  }

  ResetPagination() {
    this.utilizacoesMateriais = new Array<UtilizacaoMaterial>();
    this.pagina = 1;
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterOrigensMateriais(this.termo);
  }

  onScroll(termo?: string) {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterOrigensMateriais();
    }
  }

  public buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.obterOrigensMateriais(termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.obterOrigensMateriais();
  }

  private obterOrigensMateriais(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.utilizacaoMaterialService.filtrar(16, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.utilizacoesMateriais = this.utilizacoesMateriais.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.utilizacoesMateriais = new Array<UtilizacaoMaterial>();
          this.totalPaginas = 1;
          this.totalResultados = 0;
        }
        this.blockUI.stop();
      },
      responseError => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public onEditarClick(utilizacaoMaterial: UtilizacaoMaterial) {
    const modalRef = this.modalService.open(ManterUtilizacaoMaterialComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.utilizacaoMaterial = utilizacaoMaterial;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterOrigensMateriais();
      }
    });
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterUtilizacaoMaterialComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterOrigensMateriais();
      }
    });
  }

  public onAuditoriaClick(idUtilizacaoMaterial: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'UtilizacaoMaterial';
    modalRef.componentInstance.idEntidade = idUtilizacaoMaterial;
  }

  public onExcluirClick(idUtilizacaoMaterial: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerUtilizacaoMaterial(idUtilizacaoMaterial),
        reason => {}
      );
  }

  public removerUtilizacaoMaterial(idUtilizacaoMaterial: number): any {
    this.blockUI.start();
    this.utilizacaoMaterialService.excluir(idUtilizacaoMaterial).subscribe(
      response => {
        if (response) {
          this.ResetPagination();
          this.Hydrate('');
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }
}
