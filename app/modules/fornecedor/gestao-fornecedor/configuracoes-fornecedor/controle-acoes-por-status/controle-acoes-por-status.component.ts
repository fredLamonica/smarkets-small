import { PessoaJuridica } from '@shared/models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslationLibraryService,
  AutenticacaoService,
  PessoaJuridicaService
} from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'controle-acoes-por-status',
  templateUrl: './controle-acoes-por-status.component.html',
  styleUrls: ['./controle-acoes-por-status.component.scss']
})
export class ControleAcoesPorStatusComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public form: FormGroup;
  public pessoaJuridicaCliente: PessoaJuridica;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private authService: AutenticacaoService,
    private pessoaJuridicaService: PessoaJuridicaService
  ) {}

  ngOnInit() {
    this.pessoaJuridicaCliente = this.authService.usuario().permissaoAtual.pessoaJuridica;
    this.construirFormulario();
    this.preencherFormulario();
  }

  private construirFormulario() {
    this.form = this.formBuilder.group({
      idPessoaJuridica: [null],
      emAnalisePodeParticiparCotacao: [false],
      emAnalisePodeTerPedido: [false],
      ativoComPendenciaPodeTerPedido: [false],
      ativoRetornarStatusEmAnalise: [false]
    });
  }

  private preencherFormulario() {
    this.blockUI.start();
    this.pessoaJuridicaService.obterPorId(this.pessoaJuridicaCliente.idPessoaJuridica).subscribe(
      response => {
        if (response) {
          this.form.patchValue(response);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public changeValue(event: string) {
    switch (event) {
      case 'emAnalisePodeParticiparCotacao':
        this.form.patchValue({
          emAnalisePodeParticiparCotacao: !this.form.value.emAnalisePodeParticiparCotacao
        });
        break;
      case 'emAnalisePodeTerPedido':
        this.form.patchValue({
          emAnalisePodeTerPedido: !this.form.value.emAnalisePodeTerPedido
        });
        break;
      case 'ativoComPendenciaPodeTerPedido':
        this.form.patchValue({
          ativoComPendenciaPodeTerPedido: !this.form.value.ativoComPendenciaPodeTerPedido
        });
        break;
      case 'ativoRetornarStatusEmAnalise':
        this.form.patchValue({
          ativoRetornarStatusEmAnalise: !this.form.value.ativoRetornarStatusEmAnalise
        });
        break;

      default:
        break;
    }
  }

  private montarAlterarPessoaJuridica(pessoaJuridica: PessoaJuridica) {
    this.blockUI.start();
    this.pessoaJuridicaService.alterarControleAcoesStatusFornecedor(pessoaJuridica).subscribe(
      response => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.activeModal.close(true);
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private tratarPessoaJuridica() {
    let pessoaJuridica: PessoaJuridica = this.form.value;
    this.montarAlterarPessoaJuridica(pessoaJuridica);
  }

  public confirmar() {
    this.tratarPessoaJuridica();
  }

  public cancelar() {
    this.activeModal.close(false);
  }
}
