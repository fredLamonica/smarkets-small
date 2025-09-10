import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Log } from '@shared/models';
import { LogService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss'],
})
export class AuditoriaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  nomeClasse: string;
  idEntidade: number;
  idTenant: number;
  logs: Array<Log> = new Array<Log>();

  constructor(
    private logService: LogService,
    private translationLibrary: TranslationLibraryService,
    private activeModal: NgbActiveModal,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    if (this.idTenant) {
      this.obterLogsPorTenant();
    } else {
      this.obterLogs();
    }
  }

  fechar() {
    this.activeModal.close();
  }

  private obterLogs() {
    this.blockUI.start();

    if (this.nomeClasse === 'SolicitacaoFornecedor' ||
      this.nomeClasse === 'SolicitacaoProduto') {
      this.logService.obterLogsV2(this.nomeClasse, this.idEntidade).subscribe(
        (response) => {
          if (response) {
            this.logs = this.logs.concat(response);
          } else {
            this.logs = new Array<Log>();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    } else {
      this.logService.obterLogs(this.nomeClasse, this.idEntidade).subscribe(
        (response) => {
          if (response) {
            this.logs = this.logs.concat(response);
          } else {
            this.logs = new Array<Log>();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }
  }

  private obterLogsPorTenant() {
    this.blockUI.start();
    this.logService.obterLogsPorTenant(this.nomeClasse, this.idEntidade, this.idTenant).subscribe(
      (response) => {
        if (response) {
          this.logs = this.logs.concat(response);
        } else {
          this.logs = new Array<Log>();
        }
        this.blockUI.stop();
      },
      (error) => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      },
    );
  }
}
