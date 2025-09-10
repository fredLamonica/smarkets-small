import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ContratoCatalogo, SituacaoContratoCatalogo, Usuario } from '@shared/models';
import { ArquivoService, AutenticacaoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import * as CustomValidators from '@shared/validators/custom-validators.validator';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, takeUntil, tap } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { AuditoriaComponent } from '../../../shared/components';
import { RecusaAprovacaoContratoComponent } from '../../../shared/components/modals/recusa-aprovacao-contrato/recusa-aprovacao-contrato.component';
import { AnaliseAprovacaoCatalogo } from '../../../shared/models/enums/analise-aprovacao-catalogo';
import { ContratoCatalogoService } from '../../../shared/providers/contrato-catalogo.service';
import { UsuarioService } from '../../../shared/providers/usuario.service';
import { TipoContratoCatalogo } from './../../../shared/models/enums/tipo-contrato-catalogo';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'app-manter-contrato-catalogo',
  templateUrl: './manter-contrato-catalogo.component.html',
  styleUrls: ['./manter-contrato-catalogo.component.scss'],
})
export class ManterContratoCatalogoComponent extends Unsubscriber implements OnInit, OnDestroy {

  get ExibeBtnConcluirAprovacao() {
    return this.possuiAprovacaoFaturamento || this.possuiAprovacaoItem ? true : false;
  }

  get contratoAutomatico() {
    return this.form.controls.tipoContratoCatalogo.value == TipoContratoCatalogo.Automático ? true : false;
  }

  get saldoDisponivel() {
    return this.idContrato && this.form.controls.situacao.value != SituacaoContratoCatalogo['Pendente de Aprovação'];
  }

  get exibeAlteracaoEncerramento() {
    return this.contratoCatalogo && this.contratoCatalogo.dataFimSeller != null ? true : false;
  }

  get getDataSeller() {
    return this.exibeAlteracaoEncerramento == true ? this.contratoCatalogo.dataFimSeller : null;
  }

  @BlockUI() blockUI: NgBlockUI;

  tipoContratoCatalogo = TipoContratoCatalogo;
  SituacaoContratoCatalogo = SituacaoContratoCatalogo;
  idContrato: number;
  idFornecedor: number;
  form: FormGroup;
  gestores: Array<Usuario>;
  gestores$: Observable<Array<Usuario>>;
  responsaveis$: Observable<Array<Usuario>>;
  gestoresLoading: boolean;
  responsaveisLoading: boolean;
  usuarioLogado: Usuario;
  situacaoPendente: boolean = false;
  situacaoRevisao: boolean = false;
  aprovacaoCatalogo: boolean = false;
  enviarAprovacao: boolean = false;
  analiseCatalogo = AnaliseAprovacaoCatalogo;
  saldoDiferencial: number;
  motivoRecusa: string = null;
  validadeContrato: string;
  contratoCatalogo: ContratoCatalogo;
  // #endregion

  // #region exibições

  exibirFaturamento: boolean;
  exibirCondicaoPagamento: boolean;
  exibirEstados: boolean;
  exibirItens: boolean;
  exibirParticipantes: boolean;
  exibirAnexos: boolean;

  possuiAprovacaoEstado: boolean = false;
  possuiAprovacaoCondicaoPagamento: boolean = false;
  possuiAprovacaoItem: boolean = false;
  possuiAprovacaoFaturamento: boolean = false;
  possuiInclusaoExclusaoFaturamento: boolean = false;

  maskValor = createNumberMask({
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
    integerLimit: 12,
  });

  private paramsSub: Subscription;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private contratoService: ContratoCatalogoService,
    private usuarioService: UsuarioService,
    private datePipe: DatePipe,
    private errorService: ErrorService,
    private arquivoService: ArquivoService,
    private currencyPipe: CurrencyPipe,
    private autenticacaoService: AutenticacaoService,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.subListas();
    this.contruirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    super.ngOnDestroy();
  }

  salvar() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.formularioValido()) {

      const contrato: ContratoCatalogo = this.removerMascara(this.form.getRawValue());

      if (this.idContrato) {
        this.alterar(contrato);
      } else {
        this.form.controls.situacao.disable();
        this.inserir(contrato);
      }
    } else {
      this.blockUI.stop();
    }
  }

  recuseAprovacaoCatalogo() {
    const modalMotivoRecusa = this.modalService.open(RecusaAprovacaoContratoComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalMotivoRecusa.componentInstance.contrato = this.removerMascara(this.form.getRawValue());

    modalMotivoRecusa.result.then(
      (result) => {
        if (result) {
          this.analiseAprovacaoCatalogo(AnaliseAprovacaoCatalogo.reprovado);
        }
      },
      (error) => {
        this.errorService.treatError(error);
      },
    );
  }

  analiseAprovacaoCatalogo(analise: AnaliseAprovacaoCatalogo)  {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.analiseAprovacaoCatalogo(this.idContrato, analise).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/contratos']);
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        }
      )
  }

  concluirAprovacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.concluiAprovacaoContratoFornecedor(this.idContrato).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            location.reload();
          }
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        }
      )
  }

  enviarAprovacaoContrato() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    const contrato: ContratoCatalogo = this.removerMascara(this.form.getRawValue());

    this.contratoService.enviarAprovacaoContrato(contrato).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/contratos']);
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        }
      )
  }

  dataInicioValida() {
    const form = this.form.value;
    if (!form.dataInicio || !form.dataFim) { return true; }
    if (moment(form.dataInicio).isAfter(form.dataFim)) { return false; }
    return true;
  }

  voltar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  // #region Listas
  subListas() {
    this.subGestores();
  }

  removerMascara(contrato: any): ContratoCatalogo {

    if (contrato.saldoDisponivel) {
      contrato.saldoDisponivel = +contrato.saldoDisponivel
        .replace(/\./g, '')
        .replace(',', '.');
    }
    if (contrato.saldoTotal) {
      contrato.saldoTotal = +contrato.saldoTotal
        .replace(/\./g, '')
        .replace(',', '.');
    }

    return contrato;
  }

  usuarioCustomSearchFn(term: string, item: Usuario) {
    term = term.toLowerCase();
    return (
      item.email.toLowerCase().indexOf(term) > -1 ||
      item.pessoaFisica.nome.toLowerCase().indexOf(term) > -1
    );
  }

  permitirExibirCondicaoPagamento() {
    if (!this.exibirCondicaoPagamento) { this.exibirCondicaoPagamento = true; }
  }

  permitirExibirFaturamentoContrato() {
    if (!this.exibirFaturamento) { this.exibirFaturamento = true; }
  }

  permitirExibirEstados() {
    if (!this.exibirEstados) { this.exibirEstados = true; }
  }

  permitirExibirItens() {
    if (!this.exibirItens) { this.exibirItens = true; }
  }

  possuiAprovacaoItens(event) {
    this.possuiAprovacaoItem = event;
  }

  possuiAprovacaoCondicoesPagamento(event) {
    this.possuiAprovacaoCondicaoPagamento = event;
  }

  possuiAprovacaoFaturamentos(event){
    this.possuiAprovacaoFaturamento = event;
  }

   possuiInclusaoExclusaoFaturamentos(event){
    this.possuiInclusaoExclusaoFaturamento = event;
  }

  atualizarItens(event) {
    this.form.patchValue({ quantidadeItens: this.form.value.quantidadeItens + event.length });
  }

  permitirExibirParticipantes() {
    if (!this.exibirParticipantes) { this.exibirParticipantes = true; }
  }

  atualizarParticipantes(event) {
    this.form.patchValue({
      quantidadeParticipantes: this.form.value.quantidadeParticipantes + event.length,
    });
  }
  permitirExibirAnexos() {
    if (!this.exibirAnexos) { this.exibirAnexos = true; }
  }

  exportarContratoCatalago() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.obtenhaExportarContratoCatalago(this.idContrato).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop())).subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Contrato Catalago.xls`,
          );
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private obterParametros() {
    this.paramsSub = this.route.params.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idContrato = params['idContrato'];

        if (this.idContrato) {
          this.verifiqueAlteracaoContrato();
          this.obterContrato();
        } else {
          this.form.controls.situacao.disable();
          this.blockUI.stop();
        }
      });
  }

  private obterContrato() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.obterPorId(this.idContrato).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.contratoCatalogo = response;
            this.preencherFormulario(response);
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'ContratoCatalogo';
    modalRef.componentInstance.idEntidade = this.idContrato;
  }

  verifiqueAlteracaoContrato(){
      this.blockUI.start(this.translationLibrary.translations.LOADING);
      this.contratoService.verifiqueAlteracaoContrato(this.idContrato, false)
      .subscribe(
        (response) => {
          if(response){
            this.possuiAprovacaoItem = response.possuiAprovacaoItem;
            this.possuiAprovacaoCondicaoPagamento = response.possuiAprovacaoCondicaoPagamento;
            this.possuiAprovacaoFaturamento = response.possuiAprovacaoFaturamento;
            this.possuiInclusaoExclusaoFaturamento = response.possuiInclusaoExclusaoFaturamento;
          }
          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
    }

  private contruirFormulario() {
    this.form = this.fb.group({
      idContratoCatalogo: [0],
      idTenant: [0],
      codigo: [''],
      titulo: ['', Validators.required],
      objeto: ['', Validators.required],
      idUsuarioGestor: [null, Validators.required],
      idUsuarioResponsavel: [null, Validators.required],
      idFornecedor: [0, Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      permiteColaboracao: [true, Validators.required],
      situacao: [SituacaoContratoCatalogo['Em configuração'], Validators.required],
      tipoContratoCatalogo: [TipoContratoCatalogo.Padrão, Validators.required],
      estadosAtendimento: [null],
      quantidadeItens: [0],
      saldoDisponivel: [null],
      saldoTotal: [null, Validators.compose([
        Validators.required,
        CustomValidators.decimalRequiredValidator,
      ])],
      quantidadeParticipantes: [0],
      idContratoCatalogoPai: [null],
      OrdemClone: [null],
    });
  }

  analiseDataEncerramento(analise: AnaliseAprovacaoCatalogo){
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.analiseAlteracaoEncerramentoContrato(this.idContrato, analise).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterContrato();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private preencherFormulario(contrato: ContratoCatalogo) {
    this.form.patchValue(contrato);
    this.idFornecedor = contrato.idFornecedor;
    contrato.dataFimSeller = this.datePipe.transform(contrato.dataFimSeller, 'dd/MM/yyyy');

    this.saldoDiferencial = contrato.saldoTotal - contrato.saldoDisponivel;
    this.motivoRecusa = contrato.motivoRecusa;
    this.validadeContrato = contrato.validadeContrato;
    this.configureCondicoes(contrato);

    this.form.patchValue({
      saldoDisponivel: this.currencyPipe.transform(
        contrato.saldoDisponivel ? contrato.saldoDisponivel : '0',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
      saldoTotal: this.currencyPipe.transform(
        contrato.saldoTotal ? contrato.saldoTotal : '',
        undefined,
        '',
        '1.2-4',
        'pt-BR',
      ),
    })
  }

  private configureCondicoes(contrato: ContratoCatalogo) {

    if (contrato.situacao == SituacaoContratoCatalogo['Pendente de Aprovação']) {
      this.form.controls.situacao.disable();
      this.form.controls.saldoTotal.disable();
      this.form.controls.tipoContratoCatalogo.disable();
    } else {
      this.situacaoPendente = true;
    }

    if (contrato.situacao == SituacaoContratoCatalogo['Em Revisão'] && contrato.tipoContratoCatalogo == TipoContratoCatalogo.Automático) {
      this.form.controls.situacao.disable();
      this.form.controls.tipoContratoCatalogo.disable();
      this.enviarAprovacao = true;
    } else {
      this.situacaoRevisao = true;
    }

    if (this.idContrato && contrato.situacao == SituacaoContratoCatalogo['Pendente de Aprovação']
      && contrato.idUsuarioGestor == this.autenticacaoService.usuario().idUsuario) {
      this.aprovacaoCatalogo = true;
    }

    if ([SituacaoContratoCatalogo.Ativo, SituacaoContratoCatalogo.Inativo].includes(contrato.situacao)) {
      this.form.controls.tipoContratoCatalogo.disable();
    }
  }

  private formularioValido(): boolean {

    if (this.form.controls.tipoContratoCatalogo.value === TipoContratoCatalogo.Padrão) {
      this.form.controls.saldoTotal.disable();
      this.form.controls.saldoDisponivel.disable();
    }

    if (this.form.invalid) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (this.form.controls.idFornecedor.value === 0) {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      return false;
    }

    if (!this.dataInicioValida()) {
      this.toastr.warning('Data de início deve ser anterior a data de encerramento');
      return false;
    }

    if (this.form.controls.tipoContratoCatalogo.value === TipoContratoCatalogo.Automático
      && this.form.controls.saldoTotal.value === '') {
      this.toastr.warning('Saldo Inicial deve ser preenchido');
      return false;
    }

    const dataFimContrato = this.datePipe.transform(this.form.controls.dataFim.value, 'yyyy-MM-dd');
    const today = moment().format('YYYY-MM-DD');

    if (dataFimContrato < today) {
      this.toastr.warning('Data de encerramento deve ser posterior a data de atual');
      return false;
    }

    return true;
  }

  private inserir(contrato: ContratoCatalogo) {
    this.contratoService.inserir(contrato).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          if (response) {
            this.router.navigate(['/contratos/', response.idContratoCatalogo]);
          }
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.form.controls.situacao.enable();
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private alterar(contrato: ContratoCatalogo) {
    this.contratoService.alterar(contrato).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (response) => {
          this.idFornecedor = this.form.value.idFornecedor;
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          location.reload();
        },
        (error) => {
          if (
            error.error ===
            'Não foi possível alterar o fornecedor pois já existem pedidos associados aos itens.'
          ) {
            this.toastr.warning(error.error);
            this.blockUI.stop();
          } else {
            this.errorService.treatError(error);
            this.blockUI.stop();
          }
        },
      );
  }

  private subGestores() {
    this.gestoresLoading = true;
    this.responsaveisLoading = true;
    this.gestores$ = this.usuarioService.obterGestoresDisponiveis().pipe(
      catchError(() => of([])),
      tap(() => (this.gestoresLoading = false)),
    );
    this.responsaveis$ = this.usuarioService.obterGestoresDisponiveis().pipe(
      catchError(() => of([])),
      tap(() => (this.responsaveisLoading = false)),
    );
  }

  // #endregion
}
