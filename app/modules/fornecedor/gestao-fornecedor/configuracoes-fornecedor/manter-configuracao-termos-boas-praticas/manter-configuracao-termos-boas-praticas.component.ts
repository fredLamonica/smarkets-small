import { Component, OnInit } from '@angular/core';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConfiguracaoTermosBoasPraticasService, TranslationLibraryService, ArquivoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfiguracaoTermosBoasPraticas, Arquivo, UnidadeMedidaTempo } from '@shared/models';

@Component({
  selector: 'app-manter-configuracao-termos-boas-praticas',
  templateUrl: './manter-configuracao-termos-boas-praticas.component.html',
  styleUrls: ['./manter-configuracao-termos-boas-praticas.component.scss']
})
export class ManterConfiguracaoTermosBoasPraticasComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public form: FormGroup;

  public UnidadeMedidaTempo = UnidadeMedidaTempo;
  public termoDeBoaPratica: ConfiguracaoTermosBoasPraticas;

  constructor(
    private configuracaoTermosBoasPraticasService: ConfiguracaoTermosBoasPraticasService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private arquivoService: ArquivoService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.construirFormulario();
    this.obterConfiguracao();
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idConfiguracaoTermosBoasPraticas: [0],
      idTenant: [0],
      idArquivo: [null],
      arquivo: [null],
      habilitado: [false],
      quantidadeTempo: [1],
      unidadeMedidaTempo: [UnidadeMedidaTempo.Dia]
    });

    this.form.controls.quantidadeTempo.setValidators([Validators.required]);
    this.form.controls.quantidadeTempo.updateValueAndValidity();
    this.form.controls.unidadeMedidaTempo.setValidators([Validators.required]);
    this.form.controls.unidadeMedidaTempo.updateValueAndValidity();
    this.form.controls.idArquivo.setValidators([Validators.required]);
    this.form.controls.idArquivo.updateValueAndValidity();
  }

  private obterConfiguracao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoTermosBoasPraticasService.obter().subscribe(
      response => {
        if (response) {
          this.termoDeBoaPratica = response;
          this.preencherFormulario(response);
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  private preencherFormulario(configuracao: ConfiguracaoTermosBoasPraticas) {
    this.form.patchValue(configuracao);
    this.form.patchValue({ desabilitado: !configuracao.habilitado });
  }

  public exigirTermo(){
    let configuracao: ConfiguracaoTermosBoasPraticas = this.form.value
    debugger
    if(configuracao.habilitado)
      this.habilitar();
    else 
      this.desabilitar();
  }

  private habilitar(){
    this.form.patchValue({ habilitado: true });
  }

  private desabilitar(){
    this.form.patchValue({ habilitado: false });
  }

  public cancelar() {
    this.activeModal.close();
  }

  private formularioValido(): boolean {
    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }
    else {
      return true;
    }
  }

  public salvar() {
    if (this.formularioValido()) {
      let configuracao: ConfiguracaoTermosBoasPraticas = this.form.value
      if (configuracao.idConfiguracaoTermosBoasPraticas){
        this.alterar(configuracao);
      }
      else{
        this.inserir(configuracao);
      }

    }
  }

  private inserir(configuracao: ConfiguracaoTermosBoasPraticas) {
    this.blockUI.start();
    this.configuracaoTermosBoasPraticasService.inserir(configuracao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.form.patchValue({ idConfiguracaoTermosBoasPraticas: response.idConfiguracaoTermosBoasPraticas });
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error("Falha ao inserir nova configuração. Por favor, tente novamente.");
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  private alterar(configuracao: ConfiguracaoTermosBoasPraticas) {
    this.blockUI.start();
    this.configuracaoTermosBoasPraticasService.alterar(configuracao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error("Falha ao inserir nova configuração para o fornecedor. Por favor, tente novamente.");
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    )
  }

  // #region Arquivo
  public async selecionarArquivo(arquivo: Arquivo) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING)
      arquivo = await this.salvarArquivo(arquivo[0]);
      this.form.patchValue({ idArquivo: arquivo.idArquivo, arquivo: arquivo });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
    this.blockUI.stop();
  }

  private async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }

  public excluirArquivo() {
    this.form.patchValue({ idArquivo: null, arquivo: null });
  }
  // #endregion

}
