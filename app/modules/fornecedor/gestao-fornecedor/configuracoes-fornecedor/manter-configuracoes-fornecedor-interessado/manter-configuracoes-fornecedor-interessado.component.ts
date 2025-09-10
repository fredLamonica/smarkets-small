import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslationLibraryService, ArquivoService, ConfiguracaoFornecedorInteressadoService } from '@shared/providers';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { Arquivo, ConfiguracaoFornecedorInteressado } from '@shared/models';

@Component({
  selector: 'app-manter-configuracoes-fornecedor-interessado',
  templateUrl: './manter-configuracoes-fornecedor-interessado.component.html',
  styleUrls: ['./manter-configuracoes-fornecedor-interessado.component.scss']
})
export class ManterConfiguracoesFornecedorInteressadoComponent implements OnInit {

  @BlockUI() blockUI: NgBlockUI;
  public form: FormGroup;

  constructor(
    private configuracaoFornecedorInteressadoService: ConfiguracaoFornecedorInteressadoService,
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
      idConfiguracaoFornecedorInteressado: [0],
      idTenant: [0],
      textoCustomizavel: [null, Validators.required],
      url: [null, Validators.compose([Validators.required, Validators.pattern("[a-z0-9_-]+")])],
      logo: [null, Validators.required]
    })
  }

  private obterConfiguracao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoFornecedorInteressadoService.obter().subscribe(
      response => {
        if (response)
          this.preencherFormulario(response);
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

  private preencherFormulario(configuracao: ConfiguracaoFornecedorInteressado) {
    this.form.patchValue(configuracao);
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
      let configuracao: ConfiguracaoFornecedorInteressado = this.form.value
      if (configuracao.idConfiguracaoFornecedorInteressado)
        this.alterar(configuracao);
      else
        this.inserir(configuracao);
    }
  }

  private inserir(configuracao: ConfiguracaoFornecedorInteressado) {
    this.blockUI.start();
    this.configuracaoFornecedorInteressadoService.inserir(configuracao).subscribe(
      response => {
        if (response) {
          this.activeModal.close(response);
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        } else {
          this.toastr.error("Falha ao inserir nova configuração. Por favor, tente novamente.");
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        if (error.status == 400) {
          switch(error.error) {
            case "Registro duplicado":
              this.toastr.warning("Link não pode ser utilizado pois já está em uso na plataforma");
              break;
            default: 
              this.toastr.warning(error.error);
              break;
          }
        } else {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      }
    );
  }

  private alterar(configuracao: ConfiguracaoFornecedorInteressado) {
    this.blockUI.start();
    this.configuracaoFornecedorInteressadoService.alterar(configuracao).subscribe(
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
          if (error.status == 400) {
            switch(error.error) {
              case "Registro duplicado":
                this.toastr.warning("Link não pode ser utilizado pois já está em uso na plataforma");
                break;
              default: 
                this.toastr.warning(error.error);
                break;
            }
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
        }
      )
  }

  // #region Logo
  public async imagenSelecionada(arquivo: Arquivo) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING)
      arquivo = await this.salvarArquivo(arquivo[0]);
      this.form.patchValue({ logo: arquivo.url });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
    this.blockUI.stop();
  }

  private async salvarArquivo(arquivo: Arquivo): Promise<Arquivo> {
    return this.arquivoService.inserir(arquivo).toPromise();
  }
  // #endregion
}
