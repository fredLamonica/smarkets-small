import { Component, OnInit } from '@angular/core';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { TranslationLibraryService, OrigemMaterialService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { OrigemMaterial } from '@shared/models';
import { ManterOrigemMaterialComponent } from '../manter-origem-material/manter-origem-material.component';
import { AuditoriaComponent, ModalConfirmacaoExclusao } from '@shared/components';

@Component({
  selector: 'listar-origem-material',
  templateUrl: './listar-origem-material.component.html',
  styleUrls: ['./listar-origem-material.component.scss']
})
export class ListarOrigemMaterialComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;
  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdOrigemMaterial';
  private termo: string = '';

  public origensMateriais: Array<OrigemMaterial> = new Array<OrigemMaterial>();

  constructor(
    private origemMaterialService: OrigemMaterialService,
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
    this.origensMateriais = new Array<OrigemMaterial>();
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
    this.origemMaterialService.filtrar(16, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.origensMateriais = this.origensMateriais.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.origensMateriais = new Array<OrigemMaterial>();
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

  public onEditarClick(origemMaterial: OrigemMaterial) {
    const modalRef = this.modalService.open(ManterOrigemMaterialComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.origemMaterial = origemMaterial;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterOrigensMateriais();
      }
    });
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterOrigemMaterialComponent, {
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

  public onAuditoriaClick(idOrigemMaterial: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'OrigemMaterial';
    modalRef.componentInstance.idEntidade = idOrigemMaterial;
  }

  public onExcluirClick(idOrigemMaterial: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerOrigemMaterial(idOrigemMaterial),
        reason => {}
      );
  }

  public removerOrigemMaterial(idOrigemMaterial: number): any {
    this.blockUI.start();
    this.origemMaterialService.excluir(idOrigemMaterial).subscribe(
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
