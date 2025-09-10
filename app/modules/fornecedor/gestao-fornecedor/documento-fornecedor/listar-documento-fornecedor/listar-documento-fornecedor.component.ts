import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  AuditoriaComponent, ModalConfirmacaoExclusao
} from '@shared/components';
import { Ordenacao, PerfilUsuario, Usuario } from '@shared/models';
import { DocumentoFornecedorDto } from '@shared/models/dto/documento-fornecedor-dto';
import {
  AutenticacaoService,
  DocumentoFornecedorService,
  TranslationLibraryService
} from '@shared/providers';
import { OperacoesFiltro } from '@shared/utils/operacoes-filtro';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { DocumentoFornecedorFiltro } from '../../../../../shared/models/fltros/documento-fornecedor-filtro';
import { VincularDocumentoFornecedorComponent } from '../vincular-documento-fornecedor/vincular-documento-fornecedor.component';
import { ManterDocumentoFornecedorComponent } from './../manter-documento-fornecedor/manter-documento-fornecedor.component';

@Component({
  selector: 'listar-documento-fornecedor',
  templateUrl: './listar-documento-fornecedor.component.html',
  styleUrls: ['./listar-documento-fornecedor.component.scss'],
})
export class ListarDocumentoFornecedorComponent implements OnInit, OperacoesFiltro {

  get podeInserirDocumentos(): boolean {
    const usuario: Usuario = this.authService.usuario();
    return (
      usuario &&
      (usuario.permissaoAtual.perfil === PerfilUsuario.Administrador ||
        usuario.permissaoAtual.perfil === PerfilUsuario.Gestor) &&
      this.authService.usuario().permissaoAtual.isSmarkets
    );
  }
  @BlockUI() blockUI: NgBlockUI;

  documentosFornecedor: Array<DocumentoFornecedorDto> = new Array<DocumentoFornecedorDto>();
  pagina: number = 1;
  documentoFornecedorFiltro: DocumentoFornecedorFiltro = new DocumentoFornecedorFiltro();
  ordenacao: Ordenacao = Ordenacao.DESC;
  itensPorPagina: number = 0; // traduzido em int.MaxValue no backend
  private totalPaginas: number;
  private itemOrdenacao: string = 'IdDocumentoFornecedor';

  constructor(
    private documentoFornecedorService: DocumentoFornecedorService,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
  ) { }

  ResetPagination() {
    this.documentosFornecedor = new Array<DocumentoFornecedorDto>();
    this.pagina = 1;
  }

  Hydrate(termo?: string) {

    this.documentoFornecedorFiltro.itemOrdenar = this.itemOrdenacao;
    this.documentoFornecedorFiltro.itensPorPagina = this.itensPorPagina;
    this.documentoFornecedorFiltro.ordenacao = this.ordenacao;
    this.documentoFornecedorFiltro.pagina = this.pagina;
    this.documentoFornecedorFiltro.termo = termo;

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.documentoFornecedorService
      .listarDocumentosTenantFiltro(this.documentoFornecedorFiltro)
      .subscribe(
        (response) => {
          if (response) {
            this.documentosFornecedor = this.documentosFornecedor.concat(response.itens);
            this.totalPaginas = response.numeroPaginas;
          } else {
            this.documentosFornecedor = new Array<DocumentoFornecedorDto>();
            this.totalPaginas = 1;
          }
          this.blockUI.stop();
        },
        (responseError) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  onScroll(termo: string = '') {
    if (this.pagina < this.totalPaginas) {
      this.pagina++;
      this.Hydrate(termo);
    }
  }

  ngOnInit() {
    this.obterDocumentosFornecedorTenant();
  }

  inserir() {
    const modalRef = this.modalService.open(ManterDocumentoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.result.then((result) => {
      if (result) {
        this.documentosFornecedor.splice(0, 0, result);
      }
    });
  }

  vincular() {
    const modalRef = this.modalService.open(VincularDocumentoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.result.then((result) => {
      if (result) {
        result.forEach((documento) => {
          this.documentosFornecedor.splice(0, 0, documento);
        });
      }
    });
  }

  editar(documentoFornecedor: DocumentoFornecedorDto) {
    const modalRef = this.modalService.open(ManterDocumentoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.documentoFornecedor = documentoFornecedor;
    modalRef.result.then((result) => {
      if (result) {
        this.obterDocumentosFornecedorTenant();
      }
    });
  }

  solicitarExclusao(idDocumentoFornecedorTenant: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true, backdrop: 'static' })
      .result.then(
        (result) => this.excluir(idDocumentoFornecedorTenant),
        (reason) => { },
      );
  }

  onAuditoriaClick(idDocumentoFornecedorTenant: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
    modalRef.componentInstance.nomeClasse = 'DocumentoFornecedorTenant';
    modalRef.componentInstance.idEntidade = idDocumentoFornecedorTenant;
  }

  private obterDocumentosFornecedorTenant() {
    this.blockUI.start();
    this.documentoFornecedorService.listarDocumentosTenant().subscribe(
      (response) => {
        if (response) {
          this.documentosFornecedor = response;
        }
        this.blockUI.stop();
      },
      (responseError) => {
        this.blockUI.stop();

        if (responseError.status === 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      },
    );
  }

  private excluir(idDocumentoFornecedorTenant: number) {
    this.blockUI.start();
    // OBS: o back faz o tratamento se irá ser uma exclusão ou desvincula
    this.documentoFornecedorService.deletarDocumentoTenant(idDocumentoFornecedorTenant).subscribe(
      (response) => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.obterDocumentosFornecedorTenant();
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      },
      (responseError) => {
        this.blockUI.stop();
        if (responseError.status === 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      },
    );
  }
}
