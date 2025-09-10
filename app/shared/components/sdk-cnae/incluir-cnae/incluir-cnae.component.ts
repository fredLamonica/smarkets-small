import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Cnae } from '@shared/models';
import { CnaeService, TranslationLibraryService } from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'incluir-cnae',
  templateUrl: './incluir-cnae.component.html',
  styleUrls: ['./incluir-cnae.component.scss']
})
export class IncluirCnaeComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  @Input() idPessoa: number;
  public selecionado: Cnae;
  public cnaesLoading: boolean = true;
  public cnaes: Array<Cnae>;

  constructor(
    private cnaeService: CnaeService,
    private toastr: ToastrService,
    private translationLibrary: TranslationLibraryService,
    public activeModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.carregarLista();
  }

  private async obterCnaes() {
    this.cnaesLoading = true;
    this.cnaeService
      .listar()
      .toPromise()
      .then(
        response => {
          if (response) {
            this.cnaesLoading = false;
            this.cnaes = response;
          }
        },
        error => {
          this.cnaesLoading = false;
        }
      );
  }

  private async carregarLista() {
    try {
      await this.obterCnaes();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
  }

  public incluirCnae() {
    if (this.validaInclusao()) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.cnaeService.inserirCnaePessoa(this.selecionado.idCnae, this.idPessoa).subscribe(
        response => {
          if (response) {
            this.close();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          }
          this.blockUI.stop();
        },
        error => {
          if (error.error) {
            error.error.forEach(e => {
              this.toastr.warning(e.message);
            });
          } else {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          }
          this.blockUI.stop();
        }
      );
    }
  }

  private validaInclusao(): boolean {
    if (!this.selecionado) {
      this.toastr.warning('Selecione um CNAE');
      return false;
    }
    if (!this.idPessoa) {
      this.toastr.warning('Não tem uma pessoa selecionada');
      return false;
    }

    return true;
  }

  public close() {
    this.activeModal.close(this.selecionado);
  }
}
