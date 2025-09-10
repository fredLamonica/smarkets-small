import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Arquivo } from '@shared/models';
import { ArquivoService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'politica-privacidade',
  templateUrl: './politica-privacidade.component.html',
  styleUrls: ['./politica-privacidade.component.scss']
})
export class PoliticaPrivacidadeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;
  public pdfUrl: string;
  private arquivoBase64: string;

  public pdfSafe: SafeUrl;

  constructor(
    public activeModal: NgbActiveModal,
    public sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    private arquivoService: ArquivoService
  ) {
    this.obterArquivo();
  }

  ngOnInit() {}

  public obterArquivo() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.arquivoService.obterBase64PoliticaPrivacidade().subscribe(
      response => {
        this.arquivoBase64 = response;
        this.gerarPdf();
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public gerarPdf() {
    this.pdfSafe = this.sanitizer.bypassSecurityTrustResourceUrl(
      'data:application/pdf;base64,' + this.arquivoBase64
    );
  }

  public confirmar() {
    this.activeModal.close(true);
  }

  public cancelar() {
    this.activeModal.close(false);
  }
}
