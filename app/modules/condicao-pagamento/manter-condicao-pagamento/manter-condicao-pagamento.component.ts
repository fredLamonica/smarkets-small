import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CondicaoPagamento, PerfilUsuario, Situacao } from '@shared/models';
import { AutenticacaoService, CondicaoPagamentoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { TipoIntegracaoErp } from '../../../shared/models/enums/tipo-integracao-erp';

@Component({
  selector: 'app-manter-condicao-pagamento',
  templateUrl: './manter-condicao-pagamento.component.html',
  styleUrls: ['./manter-condicao-pagamento.component.scss']
})
export class ManterCondicaoPagamentoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  public idCondicaoPagamento: number;
  public form: FormGroup;
  public disponibilizarIntegracaoErp: boolean;

  public Situacao = Situacao;
  public TipoIntegracaoErp = TipoIntegracaoErp;
  public condicaoPagamento: CondicaoPagamento;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private authService: AutenticacaoService,
  ) { }

  ngOnInit() {
    this.contruirFormulario();

    if (this.idCondicaoPagamento) {
      this.obterCondicaoPagamennto();

      const permissaoAtual = this.authService.usuario().permissaoAtual;
      const pessoaJuridica = permissaoAtual.pessoaJuridica;
      const perfilAtual = permissaoAtual.perfil;
      this.disponibilizarIntegracaoErp =
        [PerfilUsuario.Administrador, PerfilUsuario.Gestor, PerfilUsuario.Cadastrador].includes(perfilAtual)
        && (permissaoAtual.isSmarkets || (pessoaJuridica && pessoaJuridica.habilitarIntegracaoERP));
    }
  }

  private contruirFormulario() {
    this.form = this.fb.group({
      idCondicaoPagamento: [0],
      idTenant: [0],
      codigo: [''],
      situacao: [Situacao.Ativo, Validators.required],
      descricao: [null, Validators.required]
    });
  }

  private preencherFormulario(condicaoPagamento) {
    this.form.patchValue(condicaoPagamento);
  }

  private obterCondicaoPagamennto() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.condicaoPagamentoService.obterPorId(this.idCondicaoPagamento).subscribe(
      response => {
        if (response) {
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      }, error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    if (this.formularioValido()) {
      let condicaoPagamento: CondicaoPagamento = this.form.value;

      if (condicaoPagamento.idCondicaoPagamento) {
        this.alterar(condicaoPagamento);
      } else {
        this.inserir(condicaoPagamento);
      }
    }
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    return true;
  }

  private inserir(condicaoPagamento: CondicaoPagamento) {
    this.blockUI.start();
    this.condicaoPagamentoService.inserir(condicaoPagamento).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.success("Falha ao inserir nova condição. Por favor, tente novamente.");
        }
        this.blockUI.stop();
      }, responseError => {
        if (responseError.status == 400) {
          this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }

  private alterar(condicaoPagamento: CondicaoPagamento) {
    this.blockUI.start();
    this.condicaoPagamentoService.alterar(condicaoPagamento).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        }
        else {
          this.toastr.success("Falha ao alterar condição. Por favor, tente novamente.");
        }
        this.blockUI.stop();
      }, responseError => {
        if (responseError.status == 400) {
          this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
        }
        else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
        this.blockUI.stop();
      }
    );
  }
}
