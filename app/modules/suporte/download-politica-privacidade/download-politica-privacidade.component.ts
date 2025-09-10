import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Usuario } from '@shared/models';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { PoliticaPrivacidadeComponent } from '../../autenticacao/politica-privacidade/politica-privacidade.component';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'download-politica-privacidade',
  templateUrl: './download-politica-privacidade.component.html',
  styleUrls: ['./download-politica-privacidade.component.scss'],
})
export class DownloadPoliticaPrivacidadeComponent implements OnInit {
  @ViewChild('politica-privacidade') politicaPrivacidade: PoliticaPrivacidadeComponent;

  @BlockUI() blockUI: NgBlockUI;

  pdfUrl: string;
  usuarioAtual: Usuario;
  pdfSafe: SafeUrl;

  private arquivoBase64: string;

  constructor(
    private arquivoService: ArquivoService,
    private authService: AutenticacaoService,
    public sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
  ) { }

  ngOnInit() {
    this.obterArquivo();
    this.usuarioAtual = this.authService.usuario();
  }

  obterArquivo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.arquivoService.obterBase64PoliticaPrivacidade().subscribe(
      (response) => {
        this.arquivoBase64 = response;
        this.gerarPdf();
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }

  gerarPdf() {
    this.pdfSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:application/pdf;base64,' + this.arquivoBase64,
    );
  }
}
