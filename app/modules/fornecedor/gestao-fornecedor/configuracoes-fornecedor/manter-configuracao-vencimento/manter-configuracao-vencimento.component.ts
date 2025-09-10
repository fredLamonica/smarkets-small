import { Component, OnInit } from '@angular/core';
import {
  ConfiguracaoVencimentoService,
  AutenticacaoService,
  TranslationLibraryService
} from '@shared/providers';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracaoVencimento } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-manter-configuracao-vencimento',
  templateUrl: './manter-configuracao-vencimento.component.html',
  styleUrls: ['./manter-configuracao-vencimento.component.scss']
})
export class ManterConfiguracaoVencimentoComponent implements OnInit {
  public configuracaoVencimento = {} as ConfiguracaoVencimento;
  @BlockUI() blockUI: NgBlockUI;

  constructor(
    private configuracaoVencimentoService: ConfiguracaoVencimentoService,
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.obterConfiguracao();
  }

  private obterConfiguracao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoVencimentoService.obter().subscribe(
      response => {
        if (response) {
          this.configuracaoVencimento = response;
        }
        this.blockUI.stop();
      },
      error => {
        this.blockUI.stop();
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  public cancelar() {
    this.activeModal.close();
  }

  public salvar() {
    if (this.configuracaoVencimento.idConfiguracaoVencimento) {
      this.alterar();
    } else {
      this.adicionar();
    }
  }

  public adicionar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoVencimentoService.inserir(this.configuracaoVencimento).subscribe(
      response => {
        this.activeModal.close();
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public alterar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.configuracaoVencimentoService.alterar(this.configuracaoVencimento).subscribe(
      response => {
        this.activeModal.close();
        this.blockUI.stop();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public isNullOrWhitespace(input) {
    var a = !input;
    try {
      var b = !input.trim();
    } catch {}
    return a || b;
  }
}
