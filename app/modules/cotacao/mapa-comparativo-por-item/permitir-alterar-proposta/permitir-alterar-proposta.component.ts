import { Component, OnInit, Input } from '@angular/core';
import { CategoriaProduto, CotacaoParticipante, Cotacao } from '@shared/models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CotacaoRodadaService, TranslationLibraryService } from '@shared/providers';

@Component({
  selector: 'permitir-alterar-proposta',
  templateUrl: './permitir-alterar-proposta.component.html',
  styleUrls: ['./permitir-alterar-proposta.component.scss']
})
export class PermitirAlterarPropostaComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  readonly: boolean = false;
  public listaParticipantes: Array<CotacaoParticipante>;
  public listaFornecedorSelecionado: Array<any> = new Array<any>();

  private _cotacao: Cotacao;

  set cotacao(cotacao: Cotacao) {
    this.listaParticipantes = new Array<CotacaoParticipante>();
    this._cotacao = cotacao;
    if (this._cotacao != null) {
      this.buscarParticipantesPropostaNaoAutoriazadosAlteracao();
    }
  }

  get cotacao(): Cotacao {
    return this._cotacao;
  }

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private translationLibrary: TranslationLibraryService
  ) {}

  ngOnInit() {}

  public cancelar() {
    this.activeModal.close(false);
  }

  public enviar() {
    if (this.listaFornecedorSelecionado && this.listaFornecedorSelecionado.length > 0) {
      this.blockUI.start();
      const idCotacaoRodadaAtual = this.cotacao.rodadaAtual.idCotacaoRodada;
      this.cotacaoRodadaService
        .permitirReenviarProposta(idCotacaoRodadaAtual, this.listaFornecedorSelecionado, true)
        .subscribe(
          result => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.activeModal.close(true);
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      this.toastr.warning('Por favor, selecione pelo menos um fornecedor!');
    }
  }

  public buscarParticipantesPropostaNaoAutoriazadosAlteracao() {
    this.blockUI.start();
    const idCotacaoRodadaAtual = this.cotacao.rodadaAtual.idCotacaoRodada;
    this.cotacaoRodadaService
      .buscarParticipantesPropostaNaoAutoriazadosAlteracao(idCotacaoRodadaAtual)
      .subscribe(
        response => {
          this.listaParticipantes = response;
          this.blockUI.stop();
        },
        error => {
          this.blockUI.stop();
        }
      );
  }
}
