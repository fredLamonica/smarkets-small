import { Situacao } from './../../../shared/models/enums/situacao';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import { SdkIncluirDocumentoModalComponent } from '@shared/components/sdk-incluir-documento-modal/sdk-incluir-documento-modal.component';
import { BuyerFilter } from '@shared/models/fltros/buyer-filter';
import { ListaPessoaJuridica } from '@shared/models/lista-pessoa-juridica';
import {
  AutenticacaoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { SituacaoPessoaJuridica, SituacaoPessoaJuridicaLabel } from '@shared/models';

@Component({
  selector: 'listar-pessoa-juridica',
  templateUrl: './listar-pessoa-juridica.component.html',
  styleUrls: ['./listar-pessoa-juridica.component.scss']
})
export class ListarPessoaJuridicaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private autenticacaoService: AutenticacaoService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  itens: ListaPessoaJuridica[] = [];

  public buyerFilter: BuyerFilter = new BuyerFilter();

  public enumSituacao = SituacaoPessoaJuridica;
  public perfilFranquia = false;
  public opcoesSituacaoEmpresa = Array.from(SituacaoPessoaJuridicaLabel.values()).map(key => {
    return { label: key };
  });

  ngOnInit() {
    this.search();
  }

  public novaEmpresa() {
    const modalRef = this.modalService.open(SdkIncluirDocumentoModalComponent, {
      centered: true,
      backdrop: 'static',
      size: 'md' as 'sm'
    });
    modalRef.componentInstance.isBuyer = true;
    modalRef.result.then(result => {
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

  private redirecionaSeUnicaEmpresa(pessoas: ListaPessoaJuridica[]) {
    if (
      !this.autenticacaoService.usuario().permissaoAtual.isSmarkets &&
      pessoas.length === 1 &&
      pessoas[0].pessoasJuridicasFilho.length === 0
    ) {
      this.router.navigate([`empresas/${pessoas[0].idPessoaJuridica}`]);
    }
  }

  private navigateToCreation(document: string) {
    this.pessoaJuridicaService.alterarDocumento(document);
    this.router.navigate(['novo/dados-gerais'], {
      relativeTo: this.route
    });
  }

  private handleBuyer() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.confirmacao = `Já existe uma empresa com esse documento cadastrada na base de dados.`;
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }

  private handleSupplier() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.componentInstance.confirmacao = `Já existe um fornecedor com esse documento cadastrado na base de dados. Favor solicitar a liberação como empresa compradora via chamado de suporte.`;
    modalRef.componentInstance.confirmarLabel = 'none';
    modalRef.componentInstance.cancelarLabel = 'Fechar';
  }

  public search() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.pessoaJuridicaService.getBuyersFilter(this.buyerFilter).subscribe(
      result => {
        if (result) {
          this.itens = result.itens;
          this.perfilFranquia = this.itens.length == 1 && this.itens[0].franquia == true ? true : false;
          // this.redirecionaSeUnicaEmpresa(result.itens);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
