import { CotacaoRodadaPropostaMotivoDesclassificacao } from './../../../../shared/models/cotacao/cotacao-rodada-proposta-motivo-desclassificacao';
import { MotivoDesclassificacao } from '@shared/models/cotacao/motivo-desclassificacao';
import { Component, OnInit } from '@angular/core';
import {
  TranslationLibraryService,
  AutenticacaoService,
  CotacaoRodadaService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MotivoDesclassificacaoService } from '@shared/providers/motivo-desclassificacao.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { CotacaoRodadaProposta, Situacao } from '@shared/models';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'manter-desclassificacao-proposta',
  templateUrl: './manter-desclassificacao-proposta.component.html',
  styleUrls: ['./manter-desclassificacao-proposta.component.scss']
})
export class ManterDesclassificacaoPropostaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;

  public rodadaAtualFinalizada: boolean;

  public motivosDesclassificacao: Array<MotivoDesclassificacao>;
  public motivoDesclassificacao: MotivoDesclassificacao = new MotivoDesclassificacao();

  public cotacaoRodadaPropostaMotivoDesclassificacao: CotacaoRodadaPropostaMotivoDesclassificacao = new CotacaoRodadaPropostaMotivoDesclassificacao();
  public proposta: CotacaoRodadaProposta;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AutenticacaoService,
    private motivoDesclassificacaoService: MotivoDesclassificacaoService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.construirFormulario();
    this.obterPropostaMotivoDesclassificacao();

    if (this.rodadaAtualFinalizada) {
      this.form.disable();
    } else {
      this.obterMotivosDesclassificacao();
    }
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idCotacaoRodadaPropostaMotivoDesclassificacao: [
        this.cotacaoRodadaPropostaMotivoDesclassificacao
          .idCotacaoRodadaPropostaMotivoDesclassificacao
      ],
      idMotivoDesclassificacao: [null, Validators.required],
      justificativa: ['', Validators.required]
    });
  }

  public obterPropostaMotivoDesclassificacao() {
    this.blockUI.start();
    this.cotacaoRodadaService
      .obterMotivoDesclassificacao(this.proposta.idCotacaoRodadaProposta)
      .subscribe(response => {
        if (response) {
          this.cotacaoRodadaPropostaMotivoDesclassificacao = response;

          this.motivoDesclassificacao = response.motivoDesclassificacao;

          this.preencherFormulario();
        }
        this.blockUI.stop();
      });
  }

  public obterMotivosDesclassificacao() {
    this.blockUI.start();
    this.motivoDesclassificacaoService.listar().subscribe(response => {
      if (response) {
        this.motivosDesclassificacao = response;
      }
      this.blockUI.stop();
    });
  }

  private preencherFormulario() {
    this.form.patchValue(this.cotacaoRodadaPropostaMotivoDesclassificacao);
  }

  public salvar() {
    let motivoSelecionado = this.motivosDesclassificacao.filter(
      p => p.idMotivoDesclassificacao == this.form.value.idMotivoDesclassificacao
    );

    if (this.form.valid && motivoSelecionado.length > 0) {
      let cotacaoRodadaPropostaMotivoDesclassificacao: CotacaoRodadaPropostaMotivoDesclassificacao = this
        .form.value;
      cotacaoRodadaPropostaMotivoDesclassificacao.idCotacaoRodadaProposta = this.proposta.idCotacaoRodadaProposta;
      cotacaoRodadaPropostaMotivoDesclassificacao.situacao = true;
      if (
        cotacaoRodadaPropostaMotivoDesclassificacao.idCotacaoRodadaPropostaMotivoDesclassificacao
      ) {
        this.alterar(cotacaoRodadaPropostaMotivoDesclassificacao);
      } else {
        this.inserir(cotacaoRodadaPropostaMotivoDesclassificacao);
      }
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  private inserir(
    cotacaoRodadaPropostaMotivoDesclassificacao: CotacaoRodadaPropostaMotivoDesclassificacao
  ) {
    this.blockUI.start();
    this.cotacaoRodadaService
      .inserirMotivoDesclassificacao(cotacaoRodadaPropostaMotivoDesclassificacao)
      .subscribe(
        response => {
          if (response) {
            this.activeModal.close(response);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          } else {
            this.toastr.success(
              'Falha ao inserir novo motivo de desclassificação da proposta. Por favor, tente novamente.'
            );
          }
          this.blockUI.stop();
        },
        responseError => {
          this.blockUI.stop();
          if (responseError.status == 400) {
            this.toastr.warning(responseError.error);
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        }
      );
  }

  private alterar(motivoDesclassificacao: CotacaoRodadaPropostaMotivoDesclassificacao) {
    this.blockUI.start();
    this.cotacaoRodadaService.AlterarMotivoDesclassificacao(motivoDesclassificacao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success(
            'Falha ao alterar motivo de desclassificação. Por favor, tente novamente.'
          );
        }
        this.blockUI.stop();
      },
      responseError => {
        this.blockUI.stop();
        if (responseError.status == 400) {
          this.toastr.warning(responseError.error);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  public formatarData(data: string): string {
    if (data) {
      return this.datePipe.transform(data, 'dd/MM/yyyy - HH:mm');
    }
    return null;
  }

  public cancelar() {
    this.activeModal.close();
  }
}
