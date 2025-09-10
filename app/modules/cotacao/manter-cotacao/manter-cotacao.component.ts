import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmacaoComponent, InputTreeComponent } from '@shared/components';
import {
  Arquivo,
  CategoriaProduto,
  CondicaoPagamento,
  Cotacao,
  CotacaoItem,
  CotacaoParticipante,
  CotacaoRodada,
  Moeda,
  SituacaoCotacao,
  SituacaoCotacaoItem,
  TipoFrete,
  UnidadeMedidaTempo
} from '@shared/models';
import {
  ArquivoService,
  AutenticacaoService,
  CondicaoPagamentoService,
  CotacaoRodadaService,
  CotacaoService,
  TranslationLibraryService
} from '@shared/providers';
import { WizardComponent } from 'angular-archwizard';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ConfirmarEncerrarCotacaoComponent } from '../confirmar-encerrar-cotacao/confirmar-encerrar-cotacao.component';
import { ManterFornecedorRodadaComponent } from '../mapa-comparativo-por-item/manter-fornecedor-rodada/manter-fornecedor-rodada.component';
import { Usuario } from './../../../shared/models/usuario';

@Component({
  selector: 'app-manter-cotacao',
  templateUrl: './manter-cotacao.component.html',
  styleUrls: ['./manter-cotacao.component.scss']
})
export class ManterCotacaoComponent implements OnInit, OnDestroy {
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild(WizardComponent) public wizard: WizardComponent;
  @ViewChild(InputTreeComponent) inputTree: InputTreeComponent;

  public Moeda = Moeda;
  public TipoFrete = TipoFrete;
  public SituacaoCotacaoItem = SituacaoCotacaoItem;
  public UnidadeMedidaTempo = UnidadeMedidaTempo;
  public SituacaoCotacao = SituacaoCotacao;

  public condicoesPagamento: Array<CondicaoPagamento> = new Array<CondicaoPagamento>();

  public idCotacao: number;
  public readonly: boolean = false;

  public form: FormGroup;

  private paramsSub: Subscription;

  public rodadaAtual: CotacaoRodada;
  public rodadas: Array<CotacaoRodada>;
  public cotacao: Cotacao;

  public flagPermitirAnalise: boolean = false;

  public primeiraRodada: boolean;
  public emAndamento: boolean;

  public cancelada: boolean;
  public usuarioLogado: Usuario;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private cotacaoService: CotacaoService,
    private cotacaoRodadaService: CotacaoRodadaService,
    private arquivoService: ArquivoService,
    private condicaoPagamentoService: CondicaoPagamentoService,
    private authService: AutenticacaoService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {}

  public currentDate = this.getCurrentDate();
  public dataInicial = this.getDataInicial();
  public dataFinal = this.getDataFinalHora();

  private getCurrentDate(): string {
    return moment().format('YYYY-MM-DDTHH:mm');
  }

  private getDataInicial(): string {
    return moment().add(10, 'minute').format('YYYY-MM-DDTHH:mm');
  }

  private getDataFinalHora(): string {
    return moment().add(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm');
  }

  private getDataInicialRodada(): string {
    return moment(this.rodadaAtual.dataInicio).format('YYYY-MM-DDTHH:mm');
  }

  private getDataFinalRodada(): string {
    return moment(this.rodadaAtual.dataEncerramento).format('YYYY-MM-DDTHH:mm');
  }

  async ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    await this.obterListas();

    this.construirFormulario();
    this.obterParametros();

    this.usuarioLogado = this.authService.usuario();
  }

  ngOnDestroy() {
    if (this.paramsSub) this.paramsSub.unsubscribe();
  }

  private obterParametros() {
    this.paramsSub = this.route.params.subscribe(params => {
      this.idCotacao = params['idCotacao'];

      if (this.idCotacao) {
        this.obterCotacao();
        this.wizard.model.updateNavigationMode('free');
      } else {
        this.blockUI.stop();
      }
    });
  }

  private construirFormulario() {
    this.form = this.fb.group({
      idCotacao: [0],
      codigo: [''],
      processo: [''],
      dataInclusao: [],
      situacao: [SituacaoCotacao['Em configuração']],
      idTenant: [0],
      descricao: ['', Validators.required],
      idUsuarioCriador: [0],
      nomeUsuarioResponsavel: [this.authService.usuario().pessoaFisica.nome],
      idUsuarioResponsavel: [null],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      moeda: [Moeda.Real, Validators.required],
      termoConcordancia: [''],
      anexos: [new Array<Arquivo>()],
      itens: [new Array<CotacaoItem>()],
      participantes: [new Array<CotacaoParticipante>()],
      incoterms: [TipoFrete.Cif],
      idCondicaoPagamento: [null],
      dataInicioRodada: [null],
      dataFimRodada: [null]
    });

    this.form.controls.dataInicio.patchValue(this.dataInicial);
    this.form.controls.dataFim.patchValue(this.dataFinal);
  }

  private async obterListas() {
    try {
      this.condicoesPagamento = await this.condicaoPagamentoService.listarAtivos().toPromise();
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      this.blockUI.stop();
    }
  }

  private obterCotacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.obterCotacao(this.idCotacao).subscribe(
      response => {
        if (response) {
          this.cotacao = response;
          this.rodadaAtual = response.rodadaAtual;
          this.preencherFormulario(response);
          this.flagPermitirAnalise = this.permitirAnalise();

          this.primeiraRodada = this.cotacao.rodadaAtual
            ? this.cotacao.rodadaAtual.ordem == 1
              ? true
              : false
            : false;
          this.emAndamento =
            this.cotacao.situacao == SituacaoCotacao.Agendada &&
            moment().isBetween(
              moment(this.cotacao.rodadaAtual.dataInicio),
              moment(this.cotacao.rodadaAtual.dataEncerramento)
            );
        }

        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public obterRodadas() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoRodadaService.obterRodadasPorCotacao(this.idCotacao).subscribe(
      response => {
        if (response) {
          this.rodadas = response;
        }
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public formatarData(data: string): string {
    if (data) {
      return this.datePipe.transform(data, 'dd/MM/yyyy - HH:mm');
    }

    return null;
  }

  private preencherFormulario(cotacao: Cotacao) {
    this.form.patchValue(cotacao);

    let idCondicaoPagamento: number;
    let incoterms: TipoFrete;
    if (cotacao.itens) {
      let frete = cotacao.itens.find(x => x.incoterms != null);
      if (frete) {
        incoterms = frete.incoterms;
      }
      let cotacaoItem = cotacao.itens.find(x => x.condicaoPagamento != null);
      if (cotacaoItem) {
        idCondicaoPagamento = cotacaoItem.condicaoPagamento.idCondicaoPagamento;
      }
    }
    this.form.patchValue({
      incoterms: incoterms,
      idCondicaoPagamento: idCondicaoPagamento,
      nomeUsuarioResponsavel: cotacao.usuarioResponsavel.pessoaFisica.nome
    });

    if (
      [SituacaoCotacao.Agendada, SituacaoCotacao.Cancelada, SituacaoCotacao.Encerrada].includes(
        cotacao.situacao
      )
    ) {
      this.readonly = true;
      this.form.disable();
    }

    if (this.rodadaAtual) {
      this.preencherFormularioRodada();
    }
  }

  public isDisabled(idCotacao) {
    if (idCotacao) this.readonly = true;

    return this.readonly;
  }

  private formularioValido() {
    if (!this.idCotacao) {
      if (moment(this.form.value.dataInicio).isBefore(moment())) {
        this.toastr.warning('Data inicial deve ser posterior a data atual.');
        return false;
      }
    }

    if (!this.idCotacao) {
      if (moment(this.form.value.dataFim).isBefore(moment(this.form.value.dataInicio))) {
        this.toastr.warning('Data inicial deve ser anterior a data final.');
        return false;
      }
    }

    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    return true;
  }

  private itensValidos(): boolean {
    if (!this.form.value.itens || !this.form.value.itens.length) {
      this.toastr.warning('É necessário selecionar ao menos um item participante');
      return false;
    }

    if (!this.form.getRawValue().idCondicaoPagamento || !this.form.getRawValue().incoterms) {
      this.toastr.warning(
        'É obrigatório selecionar incoterms e condição de pagamento na aba Itens.'
      );
      return false;
    }

    return true;
  }

  private participantesValidos(): boolean {
    if (!this.form.value.participantes || !this.form.value.participantes.length) {
      this.toastr.warning('É necessário selecionar ao menos um participante');
      return false;
    }

    return true;
  }

  private itensFornecedoresValidos(): boolean {
    let categoriasFornecidas = this.form.value.participantes.reduce((categorias, participante) => {
      categorias = categorias.concat(participante.categoriasProduto);
      return categorias;
    }, new Array<CategoriaProduto>());

    for (var item of this.form.value.itens) {
      if (
        categoriasFornecidas.findIndex(
          c => c.idCategoriaProduto == item.produto.idCategoriaProduto
        ) == -1
      ) {
        this.toastr
          .warning(`Não há fornecedores participantes para a categoria da requisição ${item.idRequisicaoItem} - ${item.produto.descricao},
        é necessário selecionar ao menos um fornecedor por categoria de item participante da cotação.`);
        return false;
      }
    }

    return true;
  }

  public naoExistemCategoriasDisponiveis(event) {
    this.toastr.warning(this.translationLibrary.translations.ALERTS.NO_ITEMS_AVAILABLE);
  }

  public irSelecaoItens() {
    if (this.formularioValido()) this.nextStep();
  }

  public irSelecaoParticipantes() {
    if (this.formularioValido() && this.itensValidos()) this.nextStep();
  }

  public salvar() {
    if (
      this.form.enabled &&
      this.formularioValido() &&
      this.itensValidos() &&
      this.participantesValidos() &&
      this.itensFornecedoresValidos()
    ) {
      let cotacao: Cotacao = this.form.getRawValue();

      cotacao.itens.forEach(item => {
        if (this.form.value.idCondicaoPagamento) {
          item.idCondicaoPagamento = this.form.value.idCondicaoPagamento;
        }
        if (this.form.value.incoterms) {
          item.incoterms = this.form.value.incoterms;
        }
        if (this.form.value.moeda) {
          item.moeda = this.form.value.moeda;
        }
      });

      if (this.idCotacao) this.alterar(cotacao);
      else this.inserir(cotacao);
    }
  }

  private inserir(cotacao: Cotacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    cotacao.dataInclusao = moment().format();
    this.cotacaoService.inserir(cotacao).subscribe(
      response => {
        if (response) this.router.navigate(['/acompanhamentos', 'cotacoes', response.idCotacao]);

        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public cancelar() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Deseja cancelar a cotação?`;
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Não';
    modalRef.result.then(result => {
      if (result) {
        this.cotacaoService.cancelar(this.idCotacao).subscribe(
          response => {
            this.finalizarAnalise();
            this.form.value.situacao = SituacaoCotacao.Cancelada;
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            if (error.status == 400) this.toastr.error(error.error);
            else
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);

            this.blockUI.stop();
          }
        );
      }
    });
  }

  public exibirBotaoCotacao() {
    if (
      this.idCotacao &&
      this.form &&
      this.form.getRawValue().situacao != SituacaoCotacao.Encerrada &&
      this.form.getRawValue().situacao != SituacaoCotacao.Cancelada
    )
      return true;
    return false;
  }

  private alterar(cotacao: Cotacao) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    cotacao.dataInclusao = moment().format();
    this.cotacaoService.alterar(cotacao).subscribe(
      response => {
        this.voltar();
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.blockUI.stop();
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  public voltar() {
    this.router.navigate(['/acompanhamentos'], { queryParams: { aba: 'cotacoes' } });
  }

  public exibirBotaoSalvar() {
    return this.form && this.form.value.situacao != SituacaoCotacao.Agendada;
  }

  public obterCategoriasItensParticipantes(): Array<CategoriaProduto> {
    let itens = this.form.getRawValue().itens;
    var categorias = new Array<CategoriaProduto>();
    if (itens && itens.length)
      categorias = itens.map(item => {
        return item.produto.categoria;
      });

    categorias = categorias.reduce((unique, item) => {
      if (unique.findIndex(i => i.idCategoriaProduto == item.idCategoriaProduto) === -1)
        unique.push(item);

      return unique;
    }, new Array<CategoriaProduto>());
    return categorias;
  }

  // #region Rodada

  private preencherFormularioRodada() {
    this.form.controls.dataInicioRodada.patchValue(this.getDataInicialRodada());
    this.form.controls.dataFimRodada.patchValue(this.getDataFinalRodada());

    if (this.dataFimRodadaHabilitada()) {
      this.form.controls.dataFimRodada.enable();
    }
  }

  public dataFimRodadaHabilitada(): boolean {
    return this.botaoProrrogarVisivel();
  }

  public formularioRodadaVisivel(): boolean {
    return this.cotacao && this.cotacao.situacao != SituacaoCotacao['Em configuração'];
  }

  public prorrogar() {
    if (this.datasRodadaValida()) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.rodadaAtual.dataEncerramento = this.form.value.dataFimRodada;
      this.cotacaoRodadaService.prorrogar(this.rodadaAtual).subscribe(
        response => {
          if (this.rodadas) {
            let rodadaDesatualizada: CotacaoRodada = this.rodadas.filter(
              rodada => rodada.idCotacaoRodada == this.rodadaAtual.idCotacaoRodada
            )[0];
            rodadaDesatualizada.dataEncerramento = this.rodadaAtual.dataEncerramento;
            rodadaDesatualizada.dataFimProrrogada = this.rodadaAtual.dataEncerramento;
          }

          this.rodadaAtual.dataFimProrrogada = this.rodadaAtual.dataEncerramento;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      );
    }
  }

  private datasRodadaValida(): boolean {
    if (moment(this.form.value.dataFimRodada).isBefore(moment(this.form.value.dataInicioRodada))) {
      this.toastr.warning('Data final deve ser posterior a data de início.');
      return false;
    }

    return true;
  }

  public dataFinalRodadaDesabilitada(): boolean {
    return !this.rodadaAtual || this.rodadaAtual.finalizada;
  }

  public botaoEncerrarVisivel(): boolean {
    if (this.cotacao) {
      if (
        !this.rodadaAtual.finalizada &&
        this.cotacao.situacao == SituacaoCotacao.Agendada &&
        moment().isBetween(
          moment(this.cotacao.rodadaAtual.dataInicio),
          moment(this.cotacao.rodadaAtual.dataEncerramento)
        )
      ) {
        return true;
      }

      if (
        !this.rodadaAtual.finalizada &&
        this.cotacao.situacao == SituacaoCotacao.Agendada &&
        moment().isBetween(
          moment(this.cotacao.rodadaAtual.dataInicio),
          moment(this.cotacao.rodadaAtual.dataEncerramento)
        )
      ) {
        return true;
      }
    }
    return false;
  }

  public botaoProrrogarVisivel(): boolean {
    if (this.cotacao) {
      if (
        !this.rodadaAtual.finalizada &&
        this.cotacao.situacao == SituacaoCotacao.Agendada &&
        moment().isBetween(
          moment(this.cotacao.rodadaAtual.dataInicio),
          moment(this.cotacao.rodadaAtual.dataEncerramento)
        )
      ) {
        return true;
      }

      if (
        !this.rodadaAtual.finalizada &&
        this.cotacao.situacao == SituacaoCotacao.Agendada &&
        moment().isAfter(moment(this.cotacao.rodadaAtual.dataEncerramento))
      ) {
        return true;
      }
    }
    return false;
  }

  public agendarCotacao() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = `Deseja realizar o agendamento?`;
    modalRef.componentInstance.confirmarLabel = 'Agendar';
    modalRef.result.then(result => {
      if (result) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.cotacaoService.agendar(this.cotacao.idCotacao).subscribe(
          rodadaCriada => {
            if (rodadaCriada) {
              this.cotacao.situacao = SituacaoCotacao.Agendada;
              this.cotacao.rodadaAtual = rodadaCriada;
              this.rodadaAtual = rodadaCriada;
            }

            this.obterParametros();

            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
      }
    });
  }

  public permitirAnalise(): boolean {
    if (this.cotacao.situacao != SituacaoCotacao['Em configuração']) {
      const rodadaEmAndamento =
        this.cotacao.situacao == SituacaoCotacao.Agendada &&
        moment().isBetween(
          moment(this.cotacao.rodadaAtual.dataInicio),
          moment(this.cotacao.rodadaAtual.dataEncerramento)
        );
      const envelopeFechadoHabilitado =
        this.authService.usuario().permissaoAtual.pessoaJuridica.habilitarEnvelopeFechado;

      if (!(rodadaEmAndamento && envelopeFechadoHabilitado)) {
        return true;
      }
    }

    return false;
  }

  public abrirTelaAnalise() {
    this.router.navigate(['mapa-comparativo-item'], { relativeTo: this.route });
  }

  public encerrarRodada() {
    const modalRef = this.modalService.open(ConfirmarEncerrarCotacaoComponent, {
      centered: true,
      backdrop: 'static'
    });
    modalRef.result.then(result => {
      if (!this.isEmpty(result as string)) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);

        this.cotacaoRodadaService
          .encerrarRodadaManual(this.rodadaAtual.idCotacaoRodada, result)
          .subscribe(
            response => {
              this.rodadaAtual.finalizada = true;
              this.rodadaAtual.dataEncerramento = moment().format();

              this.atualizarEncerramentoNaListaRodadas();
              this.form.controls.dataFimRodada.disable();
              this.flagPermitirAnalise = this.permitirAnalise();

              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
            },
            error => {
              this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
              this.blockUI.stop();
            }
          );
      }
    });
  }

  public isEmpty(entrada: string) {
    return !entrada || 0 === entrada.length || entrada.match(/^ *$/) !== null;
  }

  private atualizarEncerramentoNaListaRodadas() {
    if (this.rodadas && this.rodadas.length > 0) {
      let rodadaDesatualizada: CotacaoRodada = this.rodadas.filter(
        rodada => rodada.idCotacaoRodada == this.rodadaAtual.idCotacaoRodada
      )[0];
      rodadaDesatualizada.finalizada = true;
      rodadaDesatualizada.dataEncerramento = this.rodadaAtual.dataEncerramento;
    }
  }

  public preencherColunaDataEncerramentoRodada(rodada: CotacaoRodada): string {
    if (rodada && rodada.finalizada) {
      return this.formatarData(rodada.dataEncerramento);
    }

    return '';
  }

  private finalizarAnalise() {
    this.cotacaoRodadaService.finalizar(this.cotacao.rodadaAtual.idCotacaoRodada).subscribe(
      () => {
        this.cotacao.rodadaAtual.finalizada = true;
        this.cancelada = true;
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  // #endregion

  // #region Wizard Comands

  public nextStep() {
    this.wizard.navigation.goToNextStep();
  }

  public previousStep() {
    this.wizard.navigation.goToPreviousStep();
  }

  public hasPreviousStep(): boolean {
    return this.wizard.model.hasPreviousStep();
  }

  public hasNextStep(): boolean {
    return this.wizard.model.hasNextStep();
  }
  // #endregion

  // #region Arquivos
  public async incluirArquivos(arquivos) {
    try {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      for (let i = 0; i < arquivos.length; i++) {
        arquivos[i] = await this.arquivoService.inserir(arquivos[i]).toPromise();
      }
      this.form.patchValue({
        anexos: this.form.controls.anexos.value.concat(arquivos)
      });
    } catch {
      this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
    }
    this.blockUI.stop();
  }

  public excluirArquivo(arquivo) {
    if (!this.idCotacao) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.arquivoService
        .excluir(this.form.controls.anexos.value[arquivo.index].idArquivo)
        .subscribe(
          response => {
            let anexos = this.form.controls.anexos.value;
            anexos.splice(arquivo.index, 1);
            this.form.patchValue({
              anexos: anexos
            });
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          error => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          }
        );
    } else {
      let anexos = this.form.controls.anexos.value;
      anexos.splice(arquivo.index, 1);
      this.form.patchValue({
        anexos: anexos
      });
    }
  }

  // #endregion

  public adicionarFornecedor() {
    const modalRef = this.modalService.open(ManterFornecedorRodadaComponent, {
      centered: true
    });
    modalRef.componentInstance.cotacao = this.cotacao;

    modalRef.result.then(result => {
      if (result) {
      }
    });
  }

  get exibeBtnAssumir(): boolean {
    return (
      this.cotacao.situacao !== SituacaoCotacao.Cancelada &&
      this.cotacao.situacao !== SituacaoCotacao.Encerrada
    );
  }

  public onAssumirClick() {
    if (this.validaAssumirCotacao()) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, {
        centered: true,
        backdrop: 'static'
      });

      modalRef.componentInstance.html = true;
      modalRef.componentInstance.confirmacao = `
      <p>Tem certeza de que deseja assumir a cotação <b>${this.cotacao.idCotacao}</b>? </p>
      `;

      modalRef.result.then(result => {
        if (result) this.assumir();
      });
    }
  }

  private validaAssumirCotacao(): boolean {
    if (this.cotacao.usuarioResponsavel.idUsuario === this.usuarioLogado.idUsuario) {
      this.toastr.warning('Você é o atual responsável por essa cotação');
      return false;
    }

    return true;
  }

  private assumir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.cotacaoService.assumir(this.idCotacao).subscribe(
      response => {
        if (response) {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.cotacao.usuarioResponsavel = this.authService.usuario();
          this.preencherFormulario(this.cotacao);
        }

        this.blockUI.stop();
      },
      error => {
        if (error.status == 400) this.toastr.warning(error.error);
        else this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }
}
