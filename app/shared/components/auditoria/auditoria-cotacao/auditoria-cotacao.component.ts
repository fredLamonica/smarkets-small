import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cotacao, Log } from '@shared/models';
import { LogService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-auditoria-cotacao',
  templateUrl: './auditoria-cotacao.component.html',
  styleUrls: ['./auditoria-cotacao.component.scss']
})
export class AuditoriaCotacaoComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public nomeClasse: string;
  public idEntidade: number;
  public logs: Array<Log<Cotacao>> = new Array<Log<Cotacao>>();

  constructor(
    private logService: LogService,
    private translationLibrary: TranslationLibraryService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.obterLogs();
  }

  private obterLogs() {
    this.blockUI.start();
    this.logService.obterLogs<Cotacao>(this.nomeClasse, this.idEntidade).subscribe(
      response => {
        if (response) {
          this.logs = response.map(x => {
            if (x.model) x.model = JSON.parse(x.model.toString()) as Cotacao;
            return x;
          });
        } else {
          this.logs = new Array<Log<Cotacao>>();
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public fechar() {
    this.activeModal.close();
  }
}
