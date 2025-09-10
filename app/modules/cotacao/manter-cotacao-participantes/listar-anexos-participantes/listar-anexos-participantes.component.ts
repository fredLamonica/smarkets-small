import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ArquivoDto } from '@shared/models/dto/arquivo-dto';
import { CotacaoRodadaArquivoDto } from '@shared/models/dto/cotacao-rodada-arquivo-dto';
import { TranslationLibraryService } from '@shared/providers';
import { CotacaoRodadaArquivoService } from '@shared/providers/cotacao-rodada-arquivo.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-listar-anexos-participantes',
  templateUrl: './listar-anexos-participantes.component.html',
  styleUrls: ['./listar-anexos-participantes.component.scss']
})
export class ListarAnexosParticipantesComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  public idCotacao: number;
  public idTenant: number;
  public razaoSocial: string;
  public cnpj: string;
  public cotacaoRodadaArquivos: Array<CotacaoRodadaArquivoDto>;

  constructor(
    public activeModal: NgbActiveModal,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoRodadaArquivoService: CotacaoRodadaArquivoService
  ) {}

  ngOnInit() {
    this.obterArquivos();
  }

  private obterArquivos() {
    if (!this.idCotacao || !this.idTenant) {
      return;
    }

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaArquivoService
      .ObterArquivosParticipante(this.idCotacao, this.idTenant)
      .subscribe(
        response => {
          if (response) {
            this.cotacaoRodadaArquivos = response.map(
              cotacaoRodadaArquivo => new CotacaoRodadaArquivoDto(cotacaoRodadaArquivo)
            );
          } else {
            this.cotacaoRodadaArquivos = new Array<CotacaoRodadaArquivoDto>();
          }

          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  public download(url: string) {
    <any>window.open(url);
  }

  public voltar() {
    this.activeModal.close();
  }
}
