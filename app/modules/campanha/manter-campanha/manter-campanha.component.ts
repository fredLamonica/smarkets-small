import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent } from '@shared/components';
import {
  Arquivo, Campanha, CampanhaParticipante, ContratoCatalogo, Situacao, SituacaoCampanha, SituacaoContratoCatalogo
} from '@shared/models';
import { ArquivoService, CampanhaService, TranslationLibraryService } from '@shared/providers';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SelecionarContratosCatalogoComponent } from '../selecionar-contratos-catalogo/selecionar-contratos-catalogo.component';

@Component({
  selector: 'app-manter-campanha',
  templateUrl: './manter-campanha.component.html',
  styleUrls: ['./manter-campanha.component.scss'],
})
export class ManterCampanhaComponent implements OnInit, OnDestroy {

  private get formValid(): boolean {
    if (this.form.controls.url.invalid && this.form.controls.url.errors.pattern) {
      this.toastr.warning(
        'No campo Url apenas letras minúsculas, números e os caracteres especiais \'_\' e \'-\' são permitidos',
      );
      return false;
    }

    if (this.form.controls.dataInicio.valid && this.form.controls.dataFim.valid) {
      if (moment(this.form.value.dataInicio).isAfter(moment(this.form.value.dataFim))) {
        this.toastr.warning('Data fim deve ser posterior a data de início');
        return false;
      }
    }

    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }
  @BlockUI() blockUI: NgBlockUI;

  campanhaBaseUrl: string = `${environment.appUrl}campanhas/`;

  SituacaoCampanha = SituacaoCampanha;
  SituacaoContratoCatalogo = SituacaoContratoCatalogo;
  Situacao = Situacao;

  idCampanha: number;
  form: FormGroup;

  minDataInicio: string = moment().format('YYYY-MM-DD');

  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private campanhaService: CampanhaService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private arquivoService: ArquivoService,
  ) {}

  ngOnInit() {
    this.contruirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) { this.paramsSub.unsubscribe(); }
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formValid) {
      const campanha = this.form.value;
      if (this.idCampanha) {
        this.alterar(campanha);
      } else {
        this.inserir(campanha);
      }
    } else {
      this.blockUI.stop();
    }
  }

  voltar() {
    this.router.navigate(['/', 'campanhas-catalogo']);
  }

  // #region Contratos
  incluirContrato() {
    const modalRef = this.modalService
      .open(SelecionarContratosCatalogoComponent, { centered: true, size: 'lg' })
      .result.then(
        (result) => {
          if (result) {
            result.forEach((contrato) => {
              if (
                this.form.value.contratos.findIndex(
                  (c) => c.idContratoCatalogo == contrato.idContratoCatalogo,
                ) == -1
              ) {
                this.form.patchValue({ contratos: this.form.value.contratos.concat([contrato]) });
              }
            });
          }
        },
        (reason) => {},
      );
  }

  solicitarRemocaoContrato(idContratoCatalogo: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.result.then((result) => {
      if (result) { this.removerContrato(idContratoCatalogo); }
    });
  }
  // #endregion

  // #region Participantes
  ativarParticipante(campanhaParticipante: CampanhaParticipante) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar o participante?';
    modalRef.result.then((result) => {
      if (result) {
        campanhaParticipante.situacao = Situacao.Ativo;
        this.campanhaService.alterarParticipante(campanhaParticipante).subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
      }
    });
  }

  inativarParticipante(campanhaParticipante: CampanhaParticipante) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar o participante?';
    modalRef.result.then((result) => {
      if (result) {
        campanhaParticipante.situacao = Situacao.Inativo;
        this.campanhaService.alterarParticipante(campanhaParticipante).subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
      }
    });
  }
  // #endregion

  imagemSelecionada(a: Array<Arquivo>) {
    this.arquivoService.inserir(a[0]).subscribe(
      (response) => {
        this.form.controls.imagem.setValue(response);
      },
      (error) => {
        this.toastr.error(error.error);
      },
    );
  }

  removerImagem() {
    this.form.controls.imagem.setValue(null);
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe((params) => {
      this.idCampanha = params['idCampanha'];

      if (this.idCampanha) {
        this.obterCampanha();
      }
    });
  }

  private obterCampanha() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.campanhaService.obterPorId(this.idCampanha).subscribe(
      (response) => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCampanha: [0],
      idTenant: [0],
      situacao: [SituacaoCampanha['Em Configuração']],
      nome: ['', Validators.required],
      url: ['', Validators.compose([Validators.required, Validators.pattern('[a-z0-9_-]+')])],
      apresentacao: ['', Validators.required],
      termos: ['', Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      contratos: [new Array<ContratoCatalogo>()],
      participantes: [new Array<CampanhaParticipante>()],
      imagem: [null],
    });
  }

  private preencherFormulario(campanha: Campanha) {
    this.form.patchValue(campanha);
  }

  private inserir(campanha: Campanha) {
    this.campanhaService.inserir(campanha).subscribe(
      (response) => {
        if (response) {
          this.voltar();
        }
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.errorHandler(error);
        this.blockUI.stop();
      },
    );
  }

  private alterar(campanha: Campanha) {
    this.campanhaService.alterar(campanha).subscribe(
      (response) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      (error) => {
        this.errorHandler(error);
        this.blockUI.stop();
      },
    );
  }

  private errorHandler(error: any) {
    if (error && error.status == 400) {
      switch (error.error) {
        case 'Registro duplicado': {
          this.toastr.warning(
            'A Url definida já se encontra em uso por outra campanha. Escolha uma Url que não esteja em uso outra campanha.',
          );
          break;
        }
        default: {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          break;
        }
      }
    } else {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  private removerContrato(idContratoCatalogo: number) {
    this.form.patchValue({
      contratos: this.form.value.contratos.filter(
        (contrato) => contrato.idContratoCatalogo != idContratoCatalogo,
      ),
    });
  }
}
