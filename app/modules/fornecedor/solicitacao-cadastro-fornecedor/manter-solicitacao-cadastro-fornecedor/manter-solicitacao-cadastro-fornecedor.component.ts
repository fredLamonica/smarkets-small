import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { AuditoriaComponent } from '@shared/components/auditoria/auditoria.component';
import { SdkIncluirDocumentoModalComponent } from '@shared/components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import { SdkManterLogoComponent } from '@shared/components/sdk-manter-logo/sdk-manter-logo.component';
import { IMenuItem } from '@shared/components/sdk-menu-item/menu-item';
import { SituacaoPessoaJuridica } from '@shared/models';
import { CompradorInformacaoDto } from '@shared/models/dto/comprador-informacao-dto';
import {
  PessoaJuridicaService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs-compat';
import { ReloadMenuService } from './reload-menu.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-solicitacao-cadastro-fornecedor',
  templateUrl: './manter-solicitacao-cadastro-fornecedor.component.html',
  styleUrls: ['./manter-solicitacao-cadastro-fornecedor.component.scss'],
})
export class ManterSolicitacaoCadastroFornecedorComponent implements OnInit {
  get documento() {
    return this._document;
  }
  @BlockUI() blockUI: NgBlockUI;

  idPessoaJuridica: number;
  suplierInformation: CompradorInformacaoDto;
  situacaoPessoaJuridica = SituacaoPessoaJuridica;
  isCreate = false;

  itens: Array<IMenuItem>;
  private _document = '';

  private paramsSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private reloadMenuService: ReloadMenuService,
  ) {
    this.reloadMenuService.reloadMenuObserver.subscribe((idSolicitacao) => {
      this.idPessoaJuridica = idSolicitacao; this.loadMenu(false);
    });
  }

  ngOnInit() {
    this.blockUI.start();

    this.obterParametros();

    this.blockUI.stop();
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.blockUI.stop();
  }

  auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SolicitacaoFornecedor';
    modalRef.componentInstance.idEntidade = this.idPessoaJuridica;
  }

  adicionarNovaEmpresa() {
    const modalRef = this.modalService.open(SdkIncluirDocumentoModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md' as 'sm',
    });
    modalRef.componentInstance.isBuyer = true;
    modalRef.result.then((result) => {
      if (result) {
        if (result.isExistent) {
          if (result.isBuyer) {
            this.handleBuyer();
          } else {
            this.handleSupplier();
          }
        } else {
          this.navigateToCreation(result.document);
        }
      }
    });
  }

  adicionarLogo() {
    const modalRef = this.modalService.open(SdkManterLogoComponent, {
      centered: true,
      size: 'lg',
      windowClass: 'modal-manter-logo',
    });
    if (this.idPessoaJuridica) {
      modalRef.componentInstance.idPessoaJuridica = this.idPessoaJuridica;
    } else {
      const logo = this.pessoaJuridicaService.obterLogo();
      if (logo) {
        modalRef.componentInstance.oldLogo = logo;
        modalRef.componentInstance.isUpdate = true;
      }
      modalRef.result.then((result) => {
        if (result) {
          this.pessoaJuridicaService.alterarLogo(result);
        }
      });
    }
  }

  getStatusMessage(situacaoPessoaJuridica: SituacaoPessoaJuridica): string {
    switch (situacaoPessoaJuridica) {
      case SituacaoPessoaJuridica.Pendente:
        return 'Em Configuração';
      default:
        return 'Em Configuração';
        break;
    }
  }

  showStatus(situacaoPessoaJuridica: SituacaoPessoaJuridica): boolean {
    return this.isCreate || situacaoPessoaJuridica === SituacaoPessoaJuridica.Pendente;
  }

  getStatusColor(situacaoPessoaJuridica: SituacaoPessoaJuridica): string {
    switch (situacaoPessoaJuridica) {
      case SituacaoPessoaJuridica.Ativa:
        return '#8BC34A';

      case SituacaoPessoaJuridica.Inativa:
        return '#F44336';

      case SituacaoPessoaJuridica.Pendente:
        return '#FF9800';
      default:
        return '#FF9800';
        break;
    }
  }

  getMenuIcon(situacaoPessoaJuridica: SituacaoPessoaJuridica): string {
    switch (situacaoPessoaJuridica) {
      case SituacaoPessoaJuridica.Ativa:
        if (this.suplierInformation.holding) {
          return 'fas fa-industry';
        }
        if (this.suplierInformation.filial) {
          return 'fas fa-store-alt';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && !this.suplierInformation.franquia) {
          return 'fas fa-building';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && this.suplierInformation.franquia) {
          return 'fas fa-store';
        }
        break;

      case SituacaoPessoaJuridica.Inativa:
        if (this.suplierInformation.holding) {
          return 'fas fa-industry';
        }
        if (this.suplierInformation.filial) {
          return 'fas fa-store-alt';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && !this.suplierInformation.franquia) {
          return 'fas fa-building';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && this.suplierInformation.franquia) {
          return 'fas fa-store';
        }
        break;

      case SituacaoPessoaJuridica.Pendente:
        return 'fas fa-question-circle';
        break;

      default:
        return 'fas fa-question-circle';
    }
  }

  getMenuIconColor(situacaoPessoaJuridica: SituacaoPessoaJuridica): string {
    switch (situacaoPessoaJuridica) {
      case SituacaoPessoaJuridica.Ativa:
        if (this.suplierInformation.holding) {
          return '#27ADE4';
        }
        if (this.suplierInformation.filial) {
          return '#B8CAD1';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && !this.suplierInformation.franquia) {
          return '#7DCEEF';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && this.suplierInformation.franquia) {
          return '#7DCEEF';
        }
        break;

      case SituacaoPessoaJuridica.Inativa:
        if (this.suplierInformation.holding) {
          return '#27ADE4';
        }
        if (this.suplierInformation.filial) {
          return '#B8CAD1';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && !this.suplierInformation.franquia) {
          return '#7DCEEF';
        }

        if (!this.suplierInformation.holding && !this.suplierInformation.filial && this.suplierInformation.franquia) {
          return '#7DCEEF';
        }
        break;

      case SituacaoPessoaJuridica.Pendente:
        return '#CFD8DC';
      default:
        return '#CFD8DC';
    }
  }

  private loadMenu(isCreate) {
    this.itens = [
      <IMenuItem>{
        label: 'Dados Gerais',
        url: `dados-gerais/${this.idPessoaJuridica ? this.idPessoaJuridica : 'novo'}`,
        locked: false,
      },
      <IMenuItem>{
        label: 'Endereços',
        url: `enderecos/${this.idPessoaJuridica ? this.idPessoaJuridica : 'novo'}`,
        locked: isCreate,
      },
      <IMenuItem>{
        label: 'Usuários',
        url: `usuarios/${this.idPessoaJuridica ? this.idPessoaJuridica : 'novo'}`,
        locked: isCreate,
      },
    ];
  }

  private obterParametros() {

    this.paramsSub = this.route.firstChild.params.subscribe((params) => {
      if (params['id']) {
        this.idPessoaJuridica = +params['id'];
        if (params['id'] === 'novo') {
          return this.loadMenu(true);
        }
        return this.loadMenu(false);
      }

    });

  }

  private navigateToCreation(document: string) {
    this.pessoaJuridicaService.alterarDocumento(document);
    this.router.navigate(['./../novo', this.idPessoaJuridica, 'dados-gerais'], {
      relativeTo: this.route,
    });
  }

  private handleBuyer() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.confirmacao = `Já existe uma empresa com esse documento cadastrada na base de dados`;
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }

  private handleSupplier() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static',
    });
    modalRef.componentInstance.confirmacao = `Já existe um fornecedor com esse documento cadastrado na base de dados. Favor solicitar a liberação como empresa compradora via chamado de suporte.`;
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }
}
