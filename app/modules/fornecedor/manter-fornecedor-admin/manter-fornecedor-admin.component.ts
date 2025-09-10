import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import { ModalCategoriaFornecimentoComponent } from '@shared/components/modal-categoria-fornecimento/modal-categoria-fornecimento.component';
import {
  PerfilUsuario,
  StatusFornecedor,
  StatusFornecedorLabel,
  TipoDocumentoFornecedor,
  Usuario
} from '@shared/models';
import { InfosFornecedor } from '@shared/models/dto/infos-fornecedor';
import { FornecedorService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { AutenticacaoService } from './../../../shared/providers/autenticacao.service';

// tslint:disable-next-line: class-name
interface listItem {
  label: string;
  url: string;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'manter-fornecedor-novo-gestor',
  templateUrl: './manter-fornecedor-admin.component.html',
  styleUrls: ['./manter-fornecedor-admin.component.scss'],
})
export class ManterFornecedorAdminComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() routeString: string;

  itens: listItem[] = [];
  tipoDocumentoSelecionado: TipoDocumentoFornecedor;
  infosFornecedor: InfosFornecedor = new InfosFornecedor();
  idPessoaJuridicaFornecedor: number;
  statusFornecedorLabel = StatusFornecedorLabel;
  dataAtual: Date;
  documento: string;

  statusFornecedor = StatusFornecedor;

  private currentUser: Usuario;

  private idTenantFornecedor: number = null;

  constructor(
    private fornecedorService: FornecedorService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private modalService: NgbModal,
    private autenticacaoService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.currentUser = this.autenticacaoService.usuario();
    this.obterParametros();
    this.documento = this.fornecedorService.obterDocumento();
    const paramId = this.route.snapshot.params.id;
    if (paramId) {
      this.idPessoaJuridicaFornecedor = +paramId;
      this.obterInfosFornecedor(this.idPessoaJuridicaFornecedor);
    } else {
      this.dataAtual = new Date(moment.now());
    }
    this.obterAbas();
  }

  voltar() {
    if (this.routeString == null) {
      this.location.back();
    } else {
      this.router.navigate([this.routeString]);
    }
  }

  atualizaStatus(action: number) {
    if (!this.infosFornecedor.possuiCategoriaFornecimentoInteresse) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.fornecedorService.atualizarStatus(action, this.idPessoaJuridicaFornecedor).subscribe(
        (response) => {
          if (response) {
            if (response > 0) {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.infosFornecedor.status = action;
            } else {
              this.toastr.warning('Algo não parece certo com o status do Fornecedor.');
            }

            this.blockUI.stop();
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }
  }

  solicitarAudicaoFornecedor() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'PessoaJuridica';
    modalRef.componentInstance.idEntidade = this.idPessoaJuridicaFornecedor;
  }

  abriModalCategorias() {
    const modalRef = this.modalService.open(ModalCategoriaFornecimentoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'xl' as 'lg',
    });

    modalRef.componentInstance.idFornecedor = this.infosFornecedor.idFornecedor;

    modalRef.result.then((result) => {
      if (result) {
        this.obterInfosFornecedor(this.idPessoaJuridicaFornecedor);
      }
    });
  }

  itemActiveRoute(item: string): boolean {
    return this.router.routerState.snapshot.url.includes(item);
  }

  readonlySupplier() {
    return this.idTenantFornecedor !== this.currentUser.permissaoAtual.idTenant;
  }

  isHolding(): boolean {
    return this.currentUser.permissaoAtual.pessoaJuridica.holding;
  }

  cloneSupplier() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService.CloneToLocal([this.idPessoaJuridicaFornecedor]).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();

        this.router.navigate([`./../`], {
          relativeTo: this.route,
        });
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private obterParametros() {
    // tslint:disable-next-line: radix
    this.idTenantFornecedor = parseInt(this.route.firstChild.snapshot.params.idTenantFornecedor);
  }

  // obterInfosFornecedor() pega as poucas informações sobre o Fornecedor, e lá no backend é recuperado o Tenant do usuário atual para saber de qual fornecedor estamos falando.
  private obterInfosFornecedor(idPessoaJuridicaFornecedor: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.fornecedorService
      .obterInfosFornecedor(idPessoaJuridicaFornecedor, this.idTenantFornecedor)
      .subscribe(
        (response) => {
          if (response) {
            this.infosFornecedor = response;
            if (response.cnpj.length > 14) {
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cnpj;
            } else {
              this.tipoDocumentoSelecionado = TipoDocumentoFornecedor.Cpf;
            }
            this.blockUI.stop();
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterAbas() {
    if (this.idPessoaJuridicaFornecedor) {
      this.itens.push({ label: 'DADOS GERAIS', url: 'dados-gerais' });
      this.itens.push({ label: 'ENDEREÇOS', url: 'enderecos' });
      this.itens.push({ label: 'DOCUMENTOS', url: 'documentos' });
      this.itens.push({ label: 'USUÁRIOS', url: 'usuarios' });

      if (!this.readonlySupplier()) {
        this.itens.push({ label: 'INFORMAÇÕES BANCÁRIAS', url: 'domicilios-bancarios' });
        this.itens.push({ label: 'CNAEs', url: 'cnaes' });

        if ((this.currentUser.permissaoAtual.isSmarkets || (this.currentUser.permissaoAtual.pessoaJuridica && this.currentUser.permissaoAtual.pessoaJuridica.habilitarIntegracaoERP)) &&
          (this.currentUser.permissaoAtual.perfil === PerfilUsuario.Administrador || this.currentUser.permissaoAtual.perfil === PerfilUsuario.Gestor
            || this.currentUser.permissaoAtual.perfil === PerfilUsuario.Cadastrador)) {
          this.itens.push({ label: 'INTEGRAÇÃO ERP', url: 'integracao-erp' });
        }

        this.itens.push({ label: 'PENDÊNCIAS', url: 'pendencias' });
        this.itens.push({ label: 'PLANO DE AÇÃO', url: 'planos-acao' });
        this.itens.push({ label: 'QUESTIONÁRIOS', url: 'questionarios' });
        this.itens.push({ label: 'CARTA DE RESPONSABILIDADE', url: 'cartas-responsabilidade' });
      }
    } else {
      this.itens = [{ label: 'DADOS GERAIS', url: 'dados-gerais' }];
    }
  }
}
