import { Component, OnInit } from '@angular/core';
import { NgBlockUI } from 'ng-block-ui/lib/models/block-ui.model';
import { BlockUI } from 'ng-block-ui/lib/decorators/block-ui.decorator';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { OrganizacaoCompraService } from '@shared/providers/organizacao-compra.service';
import { TranslationLibraryService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManterOrganizacaoCompraComponent } from '../manter-organizacao-compra/manter-organizacao-compra.component';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { OrganizacaoCompra } from '@shared/models/organizacao-compra';

@Component({
  selector: 'listar-organizacao-compra',
  templateUrl: './listar-organizacao-compra.component.html',
  styleUrls: ['./listar-organizacao-compra.component.scss']
})
export class ListarOrganizacaoCompraComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;
  private totalPaginas: number;
  private pagina: number;
  private totalResultados: number;
  private itemOrdenacao: string = 'IdOrganizacaoCompra';
  private termo: string = '';

  public organizacoesCompra: Array<OrganizacaoCompra> = new Array<OrganizacaoCompra>();

  constructor(
    private organizacaoCompraService: OrganizacaoCompraService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.ResetPagination();
    this.obterOrganizacoesCompra();
  }

  public buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.obterOrganizacoesCompra(termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.obterOrganizacoesCompra();
  }

  public ResetPagination() {
    this.organizacoesCompra = new Array<OrganizacaoCompra>();
    this.pagina = 1;
  }

  public onScroll() {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.obterOrganizacoesCompra();
    }
  }

  Hydrate(termo?: string) {
    this.termo = termo;
    this.obterOrganizacoesCompra(this.termo);
  }

  private obterOrganizacoesCompra(termo: string = '') {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.organizacaoCompraService.filtrar(8, this.pagina, this.termo).subscribe(
      response => {
        if (response) {
          this.organizacoesCompra = this.organizacoesCompra.concat(response.itens);
          this.totalPaginas = response.numeroPaginas;
          this.totalResultados = response.total;
        } else {
          this.organizacoesCompra = new Array<OrganizacaoCompra>();
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

  public onEditarClick(organizacaoCompra: OrganizacaoCompra) {
    const modalRef = this.modalService.open(ManterOrganizacaoCompraComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.organizacaoCompra = organizacaoCompra;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterOrganizacoesCompra();
      }
    });
  }

  public onAuditoriaClick(idOrganizacaoCompra: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'OrganizacaoCompra';
    modalRef.componentInstance.idEntidade = idOrganizacaoCompra;
  }

  public onExcluirClick(idOrganizacaoCompra: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerIva(idOrganizacaoCompra),
        reason => {}
      );
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterOrganizacaoCompraComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.obterOrganizacoesCompra();
      }
    });
  }

  private removerIva(idOrganizacaoCompra: number) {
    this.blockUI.start();
    this.organizacaoCompraService.excluir(idOrganizacaoCompra).subscribe(
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
