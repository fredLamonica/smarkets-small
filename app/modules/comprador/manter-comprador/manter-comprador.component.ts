import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { AuditoriaComponent } from '@shared/components/auditoria/auditoria.component';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { SdkIncluirDocumentoModalComponent } from '@shared/components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import { SdkManterLogoComponent } from '@shared/components/sdk-manter-logo/sdk-manter-logo.component';
import { IMenuItem } from '@shared/components/sdk-menu-item/menu-item';
import { SituacaoPessoaJuridica } from '@shared/models';
import { CompradorInformacaoDto } from '@shared/models/dto/comprador-informacao-dto';
import {
  PessoaJuridicaService, TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { takeUntil } from 'rxjs/operators';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-comprador',
  templateUrl: './manter-comprador.component.html',
  styleUrls: ['./manter-comprador.component.scss'],
})
export class ManterCompradorComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  idPessoaJuridica: number;
  buyerInformation: CompradorInformacaoDto;
  situacaoPessoaJuridica = SituacaoPessoaJuridica;
  isCreate = false;
  itens: Array<IMenuItem>;
  rotaVoltar: string;

  get documento() {
    return this._document;
  }

  private _document = '';

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
  ) {
    super();
  }

  async ngOnInit() {
    this.blockUI.start();

    await this.obterParametros();

    if (this.idPessoaJuridica) {
      this.buyerInformation = await this.pessoaJuridicaService
        .getBuyerInformation(this.idPessoaJuridica)
        .toPromise();
    }

    this.loadMenu();

    this.blockUI.stop();
  }

  voltar() {
    this.router.navigate([this.rotaVoltar]);
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.blockUI.stop();
  }

  auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
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
    }
  }

  getMenuIcon(situacaoPessoaJuridica: SituacaoPessoaJuridica): string {
    switch (situacaoPessoaJuridica) {
      case SituacaoPessoaJuridica.Ativa:
        if (this.buyerInformation.holding) {
          return 'fas fa-industry';
        }
        if (this.buyerInformation.filial) {
          return 'fas fa-store-alt';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && !this.buyerInformation.franquia) {
          return 'fas fa-building';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && this.buyerInformation.franquia) {
          return 'fas fa-store';
        }

        break;

      case SituacaoPessoaJuridica.Inativa:
        if (this.buyerInformation.holding) {
          return 'fas fa-industry';
        }
        if (this.buyerInformation.filial) {
          return 'fas fa-store-alt';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && !this.buyerInformation.franquia) {
          return 'fas fa-building';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && this.buyerInformation.franquia) {
          return 'fas fa-store';
        }

        break;

      case SituacaoPessoaJuridica.Pendente:
        return 'fas fa-question-circle';

      default:
        return 'fas fa-question-circle';
    }
  }

  getMenuIconColor(situacaoPessoaJuridica: SituacaoPessoaJuridica): string {
    switch (situacaoPessoaJuridica) {
      case SituacaoPessoaJuridica.Ativa:
        if (this.buyerInformation.holding) {
          return '#27ADE4';
        }
        if (this.buyerInformation.filial) {
          return '#B8CAD1';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && !this.buyerInformation.franquia) {
          return '#7DCEEF';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && this.buyerInformation.franquia) {
          return '#7DCEEF';
        }

        break;

      case SituacaoPessoaJuridica.Inativa:
        if (this.buyerInformation.holding) {
          return '#27ADE4';
        }
        if (this.buyerInformation.filial) {
          return '#B8CAD1';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && !this.buyerInformation.franquia) {
          return '#7DCEEF';
        }

        if (!this.buyerInformation.holding && !this.buyerInformation.filial && this.buyerInformation.franquia) {
          return '#7DCEEF';
        }

        break;

      case SituacaoPessoaJuridica.Pendente:
        return '#CFD8DC';

      default:
        return '#CFD8DC';
    }
  }

  private loadMenu() {
    this.itens = [
      <IMenuItem>{
        label: 'Dados Gerais',
        url: 'dados-gerais',
        locked: false,
      },
      <IMenuItem>{
        label: 'Endereços',
        url: 'enderecos',
        locked: !this.canAccessMenuItem(this.buyerInformation),
      },
      <IMenuItem>{
        label: 'Usuários',
        url: 'usuarios',
        locked: !this.canAccessMenuItem(this.buyerInformation),
      },
      <IMenuItem>{
        label: 'Informações Bancárias',
        url: 'domicilios-bancarios',
        locked: !this.canAccessMenuItem(this.buyerInformation),
      },
      <IMenuItem>{
        label: 'CNAEs',
        url: 'cnaes',
        locked: !this.canAccessMenuItem(this.buyerInformation),
      },
    ];
  }

  private canAccessMenuItem(buyer: CompradorInformacaoDto): boolean {
    if (!buyer) {
      return false;
    }

    return this.idPessoaJuridica != null;
  }

  private obterParametros() {
    this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        if (params['id']) {
          this.idPessoaJuridica = +params['id'];
        } else {
          this.isCreate = true;
          this._document = this.pessoaJuridicaService.obterDocumento();
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
