import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslationLibraryService,
  SolicitacaoDocumentoFornecedorService,
  AutenticacaoService
} from '@shared/providers';
import { SolicitacaoDocumentoFornecedor, Usuario } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ModalConfirmacaoExclusao, AuditoriaComponent } from '@shared/components';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { ManterSolicitacaoDocumentosFornecedorComponent } from '../keep-document-request/keep-document-request.component';

@Component({
  selector: 'list-document-request',
  templateUrl: './list-document-request.component.html',
  styleUrls: ['./list-document-request.component.scss']
})
export class ListDocumentRequestComponent implements OnInit, OperacoesFiltro {
  @BlockUI() blockUI: NgBlockUI;

  private totalPaginas: number;
  public pagina = 1;
  private itemOrdenacao: string = 'IdSolicitacaoDocumentoFornecedor';
  private termo: string = '';

  public usuarioAtual: Usuario;
  public solicitacaoDocumentosFornecedor: Array<SolicitacaoDocumentoFornecedor>;

  constructor(
    private solicitacaoDocumentoFornecedorService: SolicitacaoDocumentoFornecedorService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private authService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.usuarioAtual = this.authService.usuario();
    this.usuarioAtual.permissaoAtual.idTenant;
    this.ResetPagination();
    this.Hydrate();
  }

  public buscar(termo) {
    this.termo = termo;
    this.ResetPagination();
    this.Hydrate(termo);
  }

  public limparFiltro() {
    this.termo = '';
    this.ResetPagination();
    this.Hydrate();
  }

  public ResetPagination() {
    this.solicitacaoDocumentosFornecedor = new Array<SolicitacaoDocumentoFornecedor>();
    this.pagina = 1;
  }

  public onScroll(termo: string = '') {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.Hydrate(termo);
    }
  }

  Hydrate(termo?: string) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.solicitacaoDocumentoFornecedorService
      .filtrar(16, this.pagina, this.itemOrdenacao, this.termo)
      .subscribe(
        response => {
          if (response) {
            this.solicitacaoDocumentosFornecedor = this.solicitacaoDocumentosFornecedor.concat(
              response.itens
            );
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.solicitacaoDocumentosFornecedor = new Array<SolicitacaoDocumentoFornecedor>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        responseError => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public inserir() {
    const modalRef = this.modalService.open(ManterSolicitacaoDocumentosFornecedorComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.Hydrate();
      }
    });
  }

  public editarItem(solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor) {
    const modalRef = this.modalService.open(ManterSolicitacaoDocumentosFornecedorComponent, {
      centered: true,
      size: 'lg'
    });
    modalRef.componentInstance.solicitacaoDocumentoFornecedor = solicitacaoDocumentoFornecedor;
    modalRef.result.then(result => {
      if (result) {
        this.ResetPagination();
        this.Hydrate();
      }
    });
  }

  public onAuditoriaClick(idSolicitacaoDocumentoFornecedor: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SolicitacaoDocumentoFornecedor';
    modalRef.componentInstance.idEntidade = idSolicitacaoDocumentoFornecedor;
  }

  public onExcluirClick(idSolicitacaoDocumentoFornecedor: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        result => this.removerSolicitacaoDocumento(idSolicitacaoDocumentoFornecedor),
        reason => {}
      );
  }

  private removerSolicitacaoDocumento(idSolicitacaoDocumentoFornecedor: number) {
    this.blockUI.start();
    this.solicitacaoDocumentoFornecedorService.excluir(idSolicitacaoDocumentoFornecedor).subscribe(
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

  public categoriasList(solicitacaoDocumento: SolicitacaoDocumentoFornecedor): string {
    return solicitacaoDocumento.categoriasFornecimento
      .map(categoria => categoria.descricao)
      .join(', ');
  }
}

