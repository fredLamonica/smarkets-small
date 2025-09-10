import { Component, EventEmitter, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Arquivo,
  CondicaoPagamento,
  Cotacao,
  CotacaoRodada,
  Moeda,
  TipoFrete
} from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService,
  CondicaoPagamentoService,
  CotacaoRodadaService,
  CotacaoService,
  PessoaJuridicaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer, Subscription, of } from 'rxjs';

import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CotacaoRodadaArquivo } from '@shared/models/cotacao/cotacao-rodada-arquivo';
import { CotacaoRodadaArquivoService } from '@shared/providers/cotacao-rodada-arquivo.service';
import * as moment from 'moment';
import { catchError, tap } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { ConfirmacaoComponent } from '../../../shared/components';
import { CanComponentDeactivate } from '../../../shared/models/interfaces/can-component-deactivate';
import { ManterCotacaoRodadaPropostaComponent } from './manter-cotacao-rodada-proposta/manter-cotacao-rodada-proposta.component';

@Component({
  selector: 'app-manter-cotacao-proposta',
  templateUrl: './manter-cotacao-proposta.component.html',
  styleUrls: ['./manter-cotacao-proposta.component.scss']
})
export class ManterCotacaoPropostaComponent implements OnInit, CanComponentDeactivate {
  @BlockUI() blockUI: NgBlockUI;

  public Moeda = Moeda;

  @ViewChild(ManterCotacaoRodadaPropostaComponent) manterProposta: ManterCotacaoRodadaPropostaComponent;

  public formPropostaItemHeader: FormGroup;

  public reenviarProposta: boolean = false;

  public cotacaoItemHeaderEvent: EventEmitter<void> = new EventEmitter();

  public maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 12
  });

  public idCotacao: number;
  public cotacao: Cotacao;
  public rodadas: Array<CotacaoRodada>;

  public rodadaAtiva: CotacaoRodada;

  private paramsSub: Subscription;

  public readonly: boolean = false;

  public condicoesPagamento$: Observable<Array<CondicaoPagamento>>;
  public condicoesPagamentoLoading = false;

  public TipoFrete = TipoFrete;

  private _flagImpostosNcm = false;
  public get flagImpostosNcm() {
    return this._flagImpostosNcm;
  }

  itensNaoSalvos = new Set<number>();

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoService: CotacaoService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private router: Router,
    private route: ActivatedRoute,
    private pessoaJuridicaService: PessoaJuridicaService,
    private formBuilder: FormBuilder,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private currencyPipe: CurrencyPipe,
    private arquivoService: ArquivoService,
    private cotacaoRodadaArquivoService: CotacaoRodadaArquivoService,
    private authService: AutenticacaoService,
    private modalService: NgbModal
  ) {}

  @HostListener('window:beforeunload', ['$event'])
    unloadNotification($event: any): void {
      $event.returnValue = true;
    }

  onItensAlterados(itensAlterados: number[]){
    itensAlterados.forEach((item) => this.itensNaoSalvos.add(item))
  }
  onItensSalvos(itenSalvos: number[]){
    itenSalvos.forEach((item) => this.itensNaoSalvos.delete(item))
  }

  canDeactivate(): boolean | Observable<boolean> {
    if(this.itensNaoSalvos.size) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, {
        centered: true,
        backdrop: 'static',
      });
      let html = `<p class="font-weight mb-3">Existe itens que não foram salvos, deseja sair da tela e descartar suas alterações?</p> <strong> Ao descartar todas as alterações não salvas serão perdidas.</strong>`


      modalRef.componentInstance.titulo = `Atenção!`;
      modalRef.componentInstance.confirmarBtnClass = `btn-outline-danger`;
      modalRef.componentInstance.cancelarBtnClass = `btn-outline-primary`;
      modalRef.componentInstance.confirmacao = html;
      modalRef.componentInstance.html = true;
      modalRef.componentInstance.cancelarLabel = 'Fechar';
      modalRef.componentInstance.confirmarLabel = 'Descartar alterações';
      return new Observable<boolean>((observer: Observer<boolean>) => {
        modalRef.result.then((result) => {
        if (result) {
          observer.next(true);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
        });
      });
    }else{
      return true;
    }
  }

  ngOnInit() {
    this.construirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
    if (this.cotacaoItemHeaderEvent) this.cotacaoItemHeaderEvent.unsubscribe();
  }

  public notificarFormHeader() {
    this.cotacaoItemHeaderEvent.emit();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idCotacao = params['idCotacao'];
      this.marcarVisualizacao();
      if (this.idCotacao) this.obterCotacao();
    });
  }

  private construirFormulario() {
    this.formPropostaItemHeader = this.formBuilder.group({
      idCondicaoPagamento: [null, Validators.required],
      condicaoPagamento: [null],
      incoterms: [null, Validators.required],
      faturamentoMinimo: [null, Validators.required],
      prazoEntrega: [null, Validators.required],
      anexos: [new Array<Arquivo>()]
    });
  }

  private subMenus() {
    this.subCondicoesPagamento();
  }

  public openCondicoesPagamento() {
    if (this.condicoesPagamento$ == null) {
      this.subCondicoesPagamento();
    }
  }

  private subCondicoesPagamento() {
    if (!(this.cotacao && this.cotacao.idTenant)) {
      return;
    }

    this.condicoesPagamentoLoading = true;
    this.condicoesPagamento$ = this.condicaoPagamentoService
      .listarPorTenant(this.cotacao.idTenant)
      .pipe(
        catchError(() => of([])),
        tap(() => (this.condicoesPagamentoLoading = false))
      );
  }

  private obterCotacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.obterPorId(this.idCotacao).subscribe(
      response => {
        this.blockUI.stop();
        if (response) this.tratarCotacao(response);
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public marcarVisualizacao() {
    if (this.idCotacao) {
      this.cotacaoService.marcarVisualizacao(this.idCotacao).subscribe(
        response => {},
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        }
      );
    }
  }

  private tratarCotacao(cotacao: Cotacao) {
    this.cotacao = cotacao;
    this._flagImpostosNcm = cotacao.pessoaJuridicaCliente.habilitarimpostoNcmCotacao;
    this.obterRodadas();
    this.subMenus();
  }

  private obterRodadas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService.obterRodadasPorCotacao(this.idCotacao).subscribe(
      response => {
        if (response) {
          this.tratarRodadas(response);
          this.checkReenviarProposta();
          this.carregarFormulario();
        }

        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private tratarRodadas(rodadas: Array<CotacaoRodada>) {
    this.rodadas = rodadas;
    if (this.rodadas && this.rodadas.length) {
      this.rodadaAtiva = this.rodadas[this.rodadas.length - 1];

      this.rodadaAtiva.itens.forEach(item => {
        item.filial = this.cotacao.itens
          .filter(p => p.idCotacaoItem == item.idCotacaoItem)
          .map(i => i.filial)[0];
      });
    }
  }

  private checkReadonly() {
    let propostaEnviada =
      this.rodadaAtiva.itens &&
      this.rodadaAtiva.itens.findIndex(
        item => !item.proposta || (item.proposta && !item.proposta.enviada)
      ) == -1;

    return (
      !moment().isBetween(
        moment(this.rodadaAtiva.dataInicio),
        moment(this.rodadaAtiva.dataEncerramento)
      ) || propostaEnviada
    );
  }

  private carregarFormulario() {
    let possuiItens = this.rodadaAtiva && this.rodadaAtiva.itens;
    let itemAtivo = possuiItens && possuiItens.find(p => p.proposta && p.proposta.ativo);

    if (itemAtivo && itemAtivo.proposta && itemAtivo.proposta.idCotacaoRodadaProposta) {
      this.formPropostaItemHeader.patchValue(itemAtivo.proposta);

      this.formPropostaItemHeader.patchValue({
        incoterms: itemAtivo.proposta.incoterms,
        idCondicaoPagamento: itemAtivo.proposta.idCondicaoPagamento
          ? itemAtivo.proposta.idCondicaoPagamento
          : null,
        condicaoPagamento: itemAtivo.proposta.condicaoPagamento
          ? itemAtivo.proposta.condicaoPagamento
          : null,
        prazoEntrega: itemAtivo.proposta.prazoEntrega ? itemAtivo.proposta.prazoEntrega : ''
      });

      this.formPropostaItemHeader.patchValue({
        faturamentoMinimo: this.currencyPipe.transform(
          itemAtivo.proposta.faturamentoMinimo ? itemAtivo.proposta.faturamentoMinimo : '',
          undefined,
          '',
          '1.2-4',
          'pt-BR'
        )
      });

      this.formPropostaItemHeader.disable();

      if (!this.rodadaAtiva.itens.some(p => p.proposta && p.proposta.ativo)) {
        this.formPropostaItemHeader.reset();
      }

      let possuiPropostaAtiva = this.rodadaAtiva.itens.some(p => p.proposta && p.proposta.ativo);
      let todasPropostasEnviada = this.rodadaAtiva.itens.every(
        p => p.proposta && p.proposta.enviada
      );

      if (
        (this.reenviarProposta && possuiPropostaAtiva) ||
        (possuiPropostaAtiva && !todasPropostasEnviada && !this.checkReadonly())
      ) {
        this.formPropostaItemHeader.enable();
      }
    } else if (
      (this.checkReadonly() && !this.reenviarProposta) ||
      this.rodadaAtiva.itens.every(p => p.proposta && !p.proposta.ativo)
    ) {
      this.formPropostaItemHeader.disable();
    }
  }

  public habilitarDesabilitarFormulario() {
    let possuiPropostaAtiva =
      this.rodadaAtiva && this.rodadaAtiva.itens.some(p => p.proposta && p.proposta.ativo);

    let possuiItemSemProposta = this.rodadaAtiva && this.rodadaAtiva.itens.some(p => !p.proposta);

    if (possuiPropostaAtiva || possuiItemSemProposta) {
      this.formPropostaItemHeader.enable();
    } else {
      this.formPropostaItemHeader.disable();
    }
  }

  private checkReenviarProposta() {
    let itensComPropostas = this.rodadaAtiva.itens.filter(item => item.proposta);

    let emAnalise =
      moment().isAfter(moment(this.rodadaAtiva.dataEncerramento)) && !this.rodadaAtiva.finalizada;

    if (emAnalise && itensComPropostas.length) {
      let idCotacaoParticipante = itensComPropostas[0].proposta.idCotacaoParticipante;

      this.obterPermissaoReenviarProposta(this.rodadaAtiva.idCotacaoRodada, idCotacaoParticipante);
    }
  }

  private obterPermissaoReenviarProposta(idCotacaoRodada: number, idCotacaoParticipante: number) {
    this.blockUI.stop();
    this.cotacaoRodadaService
      .obterPermissaoReenvioProposta(idCotacaoRodada, idCotacaoParticipante)
      .subscribe(
        response => {
          this.blockUI.stop();
          if (response) {
            this.reenviarProposta = response;
            this.carregarFormulario();
          }
        },
        error => {
          this.blockUI.stop();
        }
      );
  }

  public selecionarRodada(index: number) {
    this.rodadaAtiva = this.rodadas[index];
    this.carregarFormulario();
  }

  public voltar() {
    if(this.manterProposta.readonly){
      this.manterProposta.itensSalvos.emit(this.manterProposta.rodada.itens.map((item) => item.idCotacaoItem))
    }
    this.router.navigate(['/acompanhamentos'], { queryParams: { aba: 'cotacoes' } });
  }

  //#region Arquivos

  public async incluirArquivos(arquivos: Arquivo[]) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      let cotacaoRodadaArquivos = new Array<CotacaoRodadaArquivo>();

      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();

        this.rodadaAtiva.anexos.push(arquivos[i]);

        cotacaoRodadaArquivos.push(
          new CotacaoRodadaArquivo(
            this.rodadaAtiva.idCotacaoRodada,
            arquivos[i].idArquivo,
            this.authService.usuario().permissaoAtual.idTenant
          )
        );
      }

      await this.cotacaoRodadaArquivoService.inserir(cotacaoRodadaArquivos).toPromise();
      this.atualizarArquivosForm(arquivos);
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    } finally {
      this.blockUI.stop();
    }
  }

  private atualizarArquivosForm(arquivos: Arquivo[]) {
    this.formPropostaItemHeader.patchValue({
      anexos: this.formPropostaItemHeader.controls.anexos.value.concat(arquivos)
    });
  }

  public excluirArquivo(arquivo) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaArquivoService
      .deletar(this.rodadaAtiva.anexos[arquivo.index].idArquivo, this.rodadaAtiva.idCotacaoRodada)
      .subscribe(
        response => {
          this.rodadaAtiva.anexos.splice(arquivo.index, 1);
          this.formPropostaItemHeader.patchValue({
            anexos: this.rodadaAtiva.anexos
          });
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
  }

  //#endregion Arquivos
}
