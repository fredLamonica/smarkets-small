import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationLibraryService, IvaService } from '@shared/providers';
import { Iva } from '@shared/models/iva';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { ManterIvaComponent } from '../manter-iva/manter-iva.component';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';

@Component({
  selector: 'listar-iva',
  templateUrl: './listar-iva.component.html',
  styleUrls: ['./listar-iva.component.scss']
})
export class ListarIvaComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;
  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdIva';
  private termo: string = '';

  public ivas: Array<Iva> = new Array<Iva>();

  constructor(
    private ivaService: IvaService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterIvas();
  }

  public buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.obterIvas(termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.obterIvas();
  }

  public ResetPagination() {
    this.ivas = new Array<Iva>();
    this.pagina = 1;
  }

  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterIvas();
    }
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterIvas(this.termo);
  }
  private obterIvas(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.ivaService.filtrar(8, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.ivas = this.ivas.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.ivas = new Array<Iva>();
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

  public onEditarClick(iva: Iva) {
    const modalRef = this.modalService.open(ManterIvaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.iva = iva;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterIvas();
      }
    });
  }

  public onAuditoriaClick(idIva: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'Iva';
    modalRef.componentInstance.idEntidade = idIva;
  }

  public onExcluirClick(idIva: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerIva(idIva),
        reason => {}
      );
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterIvaComponent, { centered: true, size: 'lg' });
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterIvas();
      }
    });
  }

  private removerIva(idIva: number) {
    this.blockUI.start();
    this.ivaService.excluir(idIva).subscribe(
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
