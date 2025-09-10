import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {  ConfiguracoesDto, Usuario } from '@shared/models';
import { SituacaoSolicitacaoCadastroSlaLabel } from '@shared/models/enums/situacao-solicitacao-cadastro-sla';
import { TipoClassificacaoSlaLabel } from '@shared/models/enums/tipo-classificacao-sla';
import { TipoSolicatacaoCadastroSlaLabel } from '@shared/models/enums/tipo-solicitacao-cadastro-sla';
import { SolicitacaoCadastroSlaFiltro} from '@shared/models/fltros/solicitacao-cadastro-sla-filtro';
import {
  AutenticacaoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { SlaSolicitacaoService } from '@shared/providers/sla-solicitacao.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { ModalIncluirEditarSlaComponent } from '../modal-incluir-editar-sla/modal-incluir-editar-sla.component';

@Component({
  selector: 'listar-sla',
  templateUrl: './listar-sla.component.html',
  styleUrls: ['./listar-sla.component.scss']
})
export class ListarSlaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  private currentUser: Usuario;
  public itens: any[] = [];
  public solicitacaoCadastroSlaFilter: SolicitacaoCadastroSlaFiltro;
  public selectionEnabled: boolean = false;
  public usarSLAPadraoSmarkets: boolean;

  public statusOptions = Array.from(SituacaoSolicitacaoCadastroSlaLabel.values()).map(p => {
    return { label: p };
  });

  public tipoOptions = Array.from(TipoSolicatacaoCadastroSlaLabel.values()).map(p => {
    return { label: p };
  });

  public classificacaoOptions = Array.from(TipoClassificacaoSlaLabel.values()).map(p => {
    return { label: p };
  });

  constructor(
    private translationLibrary: TranslationLibraryService,
    private slaSolicitacaoService: SlaSolicitacaoService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private modalService: NgbModal,
    private pessoaJuridicaService: PessoaJuridicaService,
    private autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.usuario();
    this.buildFilter();
    this.getSlaSolicitacao();
    this.obterConfiguracoes();
  }

  private obterConfiguracoes() {
    this.blockUI.start();
    this.pessoaJuridicaService.obterConfiguracoes(this.autenticacaoService.usuario().permissaoAtual.pessoaJuridica.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.usarSLAPadraoSmarkets = response.usarSLAPadraoSmarkets;
        }
        this.blockUI.stop();
      },
    );
  }

  private buildFilter(): void {
    this.solicitacaoCadastroSlaFilter = new SolicitacaoCadastroSlaFiltro();
    this.solicitacaoCadastroSlaFilter.pagina = 1;
    this.solicitacaoCadastroSlaFilter.itensPorPagina = 5;
    this.solicitacaoCadastroSlaFilter.totalPaginas = 0;
  }

  public getSlaSolicitacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaSolicitacaoService
      .slaSolicitacaoFiltro(this.solicitacaoCadastroSlaFilter)
      .subscribe(
        response => {
          if (response) {
            this.itens = response.itens;
            this.solicitacaoCadastroSlaFilter.totalPaginas = response.numeroPaginas;
          } else {
            this.solicitacaoCadastroSlaFilter.pagina = 1;
            this.solicitacaoCadastroSlaFilter.totalPaginas = 0;
          }

          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public page(event) {
    this.solicitacaoCadastroSlaFilter.pagina = event.page;
    this.solicitacaoCadastroSlaFilter.itensPorPagina = event.recordsPerPage;
    this.getSlaSolicitacao();
  }

  public openModal(tipoSLA: string){
    const modalRef = this.modalService.open(ModalIncluirEditarSlaComponent, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });

    modalRef.componentInstance.tipoSLA = tipoSLA;

    modalRef.result.then(result => {
      if (result) this.getSlaSolicitacao()
    });
  }

  public editar(SlaSolicitacao: any) {
    if (!SlaSolicitacao.isSmarkets && SlaSolicitacao.statusSla == 1) {
      const modalRef = this.modalService.open(ModalIncluirEditarSlaComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.SlaSolicitacao = SlaSolicitacao;

      modalRef.result.then(result => {
        if (result) this.getSlaSolicitacao()
      });
    }
  }
}
