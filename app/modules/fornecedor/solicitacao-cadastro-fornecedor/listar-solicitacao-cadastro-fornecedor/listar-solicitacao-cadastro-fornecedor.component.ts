import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { SdkIncluirDocumentoModalComponent } from '@shared/components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import { PerfilUsuario, Usuario } from '@shared/models';
import { StatusSolicitacaoFornecedorLabel } from '@shared/models/enums/status-solicitacao-fornecedor';
import { SolicitacaoCadastroFornecedorFiltro } from '@shared/models/fltros/solicitacao-cadastro-fornecedor-filtro';
import { AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { SolicitacaoCadastroFornecedorService } from '@shared/providers/solicitacao-cadastro-fornecedor.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'listar-solicitacao-cadastro-fornecedor',
  templateUrl: './listar-solicitacao-cadastro-fornecedor.component.html',
  styleUrls: ['./listar-solicitacao-cadastro-fornecedor.component.scss'],
})
export class ListarSolicitacaoCadastroFornecedorComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  currentUser: Usuario;
  itens: any[] = [];
  solicitacaoCadastroFornecedorFiltro: SolicitacaoCadastroFornecedorFiltro;
  selectionEnabled: boolean = false;

  statusOptions = Array.from(StatusSolicitacaoFornecedorLabel.values()).map((p) => {
    return { label: p };
  });
  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
    private solicitacaoCadastroFornecedorService: SolicitacaoCadastroFornecedorService,
  ) {
    super();
  }

  ngOnInit() {
    this.currentUser = this.authService.usuario();
    this.buildFilter();
    this.getSolicitacaoCadastroFornecedor();
  }

  getSolicitacaoCadastroFornecedor() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.solicitacaoCadastroFornecedorService.filtrar(this.solicitacaoCadastroFornecedorFiltro).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.itens = response.itens;
            this.solicitacaoCadastroFornecedorFiltro.totalPaginas = response.numeroPaginas;
          } else {
            this.solicitacaoCadastroFornecedorFiltro.pagina = 1;
            this.solicitacaoCadastroFornecedorFiltro.totalPaginas = 0;
          }

          this.blockUI.stop();
        },
        (error) => {
          if (error.error) {
            error.error.forEach((e) => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        },
      );
  }

  incluirSolicitacaoCadastroFornecedor() {
    const modalRef = this.modalService.open(SdkIncluirDocumentoModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md' as 'sm',
    });

    modalRef.componentInstance.isBuyer = false;

    modalRef.result.then((result) => {
      if (result) {
        if (result.existentDocument && result.existentDocument.isExistent) {
          // tslint:disable-next-line: no-shadowed-variable
          const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true, backdrop: 'static' });

          modalRef.componentInstance.confirmacao = `Documento já cadastrado na base de dados.`;
          modalRef.componentInstance.confirmarLabel = 'none';
          modalRef.componentInstance.cancelarLabel = 'Fechar';
        } else {
          this.navigateToCreation(result.document);
        }
      }
    });
  }

  page(event) {
    this.solicitacaoCadastroFornecedorFiltro.pagina = event.page;
    this.solicitacaoCadastroFornecedorFiltro.itensPorPagina = event.recordsPerPage;
    this.getSolicitacaoCadastroFornecedor();
  }

  usuarioPodeIncluirSolicitacao(): boolean {
    return this.currentUser.permissaoAtual.perfil === PerfilUsuario.Comprador || this.currentUser.permissaoAtual.perfil === PerfilUsuario.Requisitante;
  }

  private buildFilter(): void {
    this.solicitacaoCadastroFornecedorFiltro = new SolicitacaoCadastroFornecedorFiltro();
    this.solicitacaoCadastroFornecedorFiltro.pagina = 1;
    this.solicitacaoCadastroFornecedorFiltro.itensPorPagina = 5;
    this.solicitacaoCadastroFornecedorFiltro.totalPaginas = 0;
  }

  private navigateToCreation(document: string) {
    this.solicitacaoCadastroFornecedorService.cnpj = document;
    this.router.navigate(['/fornecedores/manter-solicitacao-fornecedor/dados-gerais/novo']);
  }
}
