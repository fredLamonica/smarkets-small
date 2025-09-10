import { ActivatedRoute } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { Cnae, PessoaJuridica } from '@shared/models';
import {
  AutenticacaoService,
  CnaeService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IncluirCnaeComponent } from './incluir-cnae/incluir-cnae.component';
import { ModalConfirmacaoExclusao } from '..';

@Component({
  selector: 'sdk-cnae',
  templateUrl: './sdk-cnae.component.html',
  styleUrls: ['./sdk-cnae.component.scss']
})
export class SdkCnaeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  @Input() showFornecedor: boolean = true;
  public cnaes: Array<Cnae>;
  public disabled: boolean = false;
  iconSpotColor = '#52BDE9';
  iconSpotColorHover = '#27ADE4';
  borderColor = '#B8CAD1';
  borderWidth = '1px';
  borderColorHover = '#52bde9';
  borderStyle = 'solid';

  constructor(
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cnaeService: CnaeService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private pessoaJuridicaService: PessoaJuridicaService
  ) {}

  idPessoaJuririca: number = 0;
  private pessoaJuridica: PessoaJuridica;

  ngOnInit() {
    this.idPessoaJuririca = this.route.parent.snapshot.params.id;
    this.obterSubListas();
  }

  private obterSubListas() {
    this.obterCnaes(this.idPessoaJuririca);
    this.obterPessoaJuridica();
  }

  private obterPessoaJuridica() {
    this.pessoaJuridicaService.obterPorIdSemFiltroPermissao(this.idPessoaJuririca).subscribe(
      response => {
        if (response) {
          this.pessoaJuridica = response;
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private obterCnaes(idPessoaJuridica: Number) {
    this.cnaeService.obterCnaesPessoa(idPessoaJuridica).subscribe(
      response => {
        this.cnaes = response;
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public abrirModalCadastrarCnae() {
    if (this.pessoaJuridica) {
      const modalRef = this.modalService.open(IncluirCnaeComponent, {
        centered: true,
        backdrop: 'static',
        size: 'lg',
        windowClass: 'modal-border-radius'
      });

      modalRef.componentInstance.idPessoa = this.pessoaJuridica.idPessoa;

      modalRef.result.then(result => {
        if (result) {
          this.obterCnaes(this.idPessoaJuririca);
        }
      });
    }
  }

  public atualizarCnaes() {
    this.obterCnaes(this.idPessoaJuririca);
  }

  public resquestDeletion(cnae) {
    this.disabled = true;
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true }).result.then(
      result => {
        this.deleteCnae(cnae);
        this.disabled = false;
      },
      reason => {
        this.disabled = false;
      }
    );
  }

  private deleteCnae(cnae) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cnaeService.deletarCnae(cnae.idCnae).subscribe(
      resultado => {
        this.obterCnaes(this.idPessoaJuririca);
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public titleDescription(cnae) {
    return cnae.identificador + '-' + cnae.descricao;
  }
}
