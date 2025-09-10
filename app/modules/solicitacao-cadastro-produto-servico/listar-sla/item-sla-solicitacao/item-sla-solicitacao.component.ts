import { Component,EventEmitter,Input, OnInit, Output} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent } from '@shared/components';
import { SituacaoSolicitacaoCadastroSla, SituacaoSolicitacaoCadastroSlaLabel } from '@shared/models/enums/situacao-solicitacao-cadastro-sla';
import { TipoClassificacaoSla, TipoClassificacaoSlaLabel } from '@shared/models/enums/tipo-classificacao-sla';
import { TipoSolicatacaoCadastroSla, TipoSolicatacaoCadastroSlaLabel } from '@shared/models/enums/tipo-solicitacao-cadastro-sla';
import { AutenticacaoService, PessoaJuridicaService, TranslationLibraryService } from '@shared/providers';
import { SlaSolicitacaoService } from '@shared/providers/sla-solicitacao.service';

import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { TipoSla, TipoSlaLabel } from '../../../../shared/models';
import { ModalIncluirEditarSlaComponent } from '../../modal-incluir-editar-sla/modal-incluir-editar-sla.component';

@Component({
  selector: 'item-sla-solicitacao',
  templateUrl: './item-sla-solicitacao.component.html',
  styleUrls: ['./item-sla-solicitacao.component.scss']
})
export class ItemSlaSolicitacaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() slaSolicitacao: any;
  @Output() reloadList : EventEmitter<any> = new EventEmitter();
  public utilizaSLAPadraoSmarkets : boolean
  public disabled: boolean = false;
  public statusSlaLabel = SituacaoSolicitacaoCadastroSlaLabel;
  public statusSla = SituacaoSolicitacaoCadastroSla;
  public tipoSlaSolicitacaoLabel = TipoSolicatacaoCadastroSlaLabel;
  public tipoSlaSolicitacao = TipoSolicatacaoCadastroSla;
  public classificacaoSla = TipoClassificacaoSla;
  public classificacaoSlaLabel = TipoClassificacaoSlaLabel;
  public usarSLAPadraoSmarkets: boolean;

  constructor(
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private slaSolicitacaoService: SlaSolicitacaoService,
    private pessoaJuridicaService: PessoaJuridicaService,
    private toastr: ToastrService,
    private autenticacaoService: AutenticacaoService
  ) {}

  ngOnInit() {
    this.pessoaJuridicaUsaSLAPadraoSmarkets()
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


  public auditar(idSlaSolicitacao) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'SlaSolicitacao';
    modalRef.componentInstance.idEntidade = idSlaSolicitacao;
  }

  public inativar(slaSolicitacao){
    slaSolicitacao.statusSla = this.statusSla.Inativo;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaSolicitacaoService
      .ativaOuInativaSlaSolicitacao(slaSolicitacao)
      .subscribe(
        response => {
          if (response.result > 0 ) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.reloadList.emit();
          }
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
  }

  public ativar(slaSolicitacao){
    slaSolicitacao.statusSla = this.statusSla.Ativo;
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaSolicitacaoService
      .ativaOuInativaSlaSolicitacao(slaSolicitacao)
      .subscribe(
        response => {
          if (response.result > 0 ) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.reloadList.emit();
          }
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
  }

  public exclusao(idSlaSolicitacao){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.slaSolicitacaoService
      .excluirSlaSolicitacao(idSlaSolicitacao)
      .subscribe(
        response => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.reloadList.emit();
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );

  }

  public editar(event: Event, SlaSolicitacao: any) {
    const modalRef = this.modalService.open(ModalIncluirEditarSlaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.SlaSolicitacao = SlaSolicitacao;

    modalRef.result.then(result => {
      if (result) this.reloadList.emit();
    });
  }

  public pessoaJuridicaUsaSLAPadraoSmarkets(){
    this.pessoaJuridicaService.obterPorIdTenant(this.slaSolicitacao.idTenant).subscribe(
      response => {
        this.utilizaSLAPadraoSmarkets = response.usarSLAPadraoSmarkets;
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
