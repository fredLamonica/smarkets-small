import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { AuditoriaComponent } from '../../../shared/components';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { ContratoCatalogo, SituacaoContratoCatalogo, Usuario } from '../../../shared/models';
import { TipoContratoCatalogo } from '../../../shared/models/enums/tipo-contrato-catalogo';
import { TranslationLibraryService } from '../../../shared/providers';
import { ContratoCatalogoService } from '../../../shared/providers/contrato-catalogo.service';

@Component({
  selector: 'smk-manter-contrato-fornecedor',
  templateUrl: './manter-contrato-fornecedor.component.html',
  styleUrls: ['./manter-contrato-fornecedor.component.scss'],
})
export class ManterContratoFornecedorComponent extends Unsubscriber implements OnInit, OnDestroy {

  get possuiEdicaoContrato() {
    return this.possuiEdicaoItem == true || this.possuiEdicaoFaturamento == true;
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
  idTenant: number;
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
  saldoDiferencial: number;
  validadeContrato: string;
  contratoCatalogo: ContratoCatalogo;
  possuiEdicaoFaturamento: boolean = false;
  possuiEdicaoItem: boolean = false;

  // #endregion

  // #region Condicao Pagamento
  exibirCondicaoPagamento: boolean;
  // #endregion

  // #region Estados de atendimento
  exibirFaturamentos: boolean;
  // #endregion

  // #region Itens
  exibirItens: boolean;
  // #endregion

  // #region Participantes
  exibirParticipantes: boolean;
  // #endregion

  // #region Anexos
  exibirAnexos: boolean;

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
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    super();
  }

  ngOnInit() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contruirFormulario();
    this.obterParametros();
  }

  ngOnDestroy() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }

    super.ngOnDestroy();
  }

  voltar() {
    this.router.navigate(['./../'], { relativeTo: this.route });
  }

  // #region Listas

  permitirExibirCondicaoPagamento() {
    if (!this.exibirCondicaoPagamento) { this.exibirCondicaoPagamento = true; }
  }

  permitirExibirEstados() {
    if (!this.exibirFaturamentos) { this.exibirFaturamentos = true; }
  }

  permitirExibirItens() {
    if (!this.exibirItens) { this.exibirItens = true; }
  }

  atualizarItens(event) {
    this.form.patchValue({ quantidadeItens: this.form.value.quantidadeItens + event.length });
  }

  permiteEdicaoItem(event) {
    this.possuiEdicaoItem = event;
  }

  permiteEdicaoFaturamento(event){
    this.possuiEdicaoFaturamento = event;
  }

  auditar() {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'ContratoCatalogo';
    modalRef.componentInstance.idEntidade = this.idContrato;
    modalRef.componentInstance.idTenant = this.contratoCatalogo.idTenant;
  }

  formateDados(contrato: ContratoCatalogo) {
    contrato.dataInicio = this.datePipe.transform(contrato.dataInicio, 'yyyy-MM-dd');
    contrato.dataFim = this.datePipe.transform(contrato.dataFim, 'yyyy-MM-dd');
    contrato.dataFimSeller = this.datePipe.transform(contrato.dataFimSeller, 'dd/MM/yyyy');

    return contrato;
  }

  concluiEdicao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.concluiEdicao(this.idContrato)
      .subscribe(
        (response) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          location.reload();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        });
  }

  soliciteAlteracaoDadosGerais() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    if (this.valideInformacao()) {
      this.contratoService
        .soliciteAlteracaoEncerramentoContrato(this.idContrato, this.form.controls.dataFim.value)
        .subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.obterContrato();
          },
          (error) => {
            this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
            this.blockUI.stop();
          },
        );
    } else {
      this.blockUI.stop();
    }
  }
  // #endregion

  verifiqueEdicaoContrato() {
    this.contratoService.verifiqueAlteracaoContrato(this.idContrato, true)
      .subscribe(
        (response) => {
          if (response) {
            this.possuiEdicaoFaturamento = response.possuiAlteracaoFaturamento;
            this.possuiEdicaoItem = response.possuiAlteracaoItem;
          }
        },
        (error) => {
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
          this.verifiqueEdicaoContrato();
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

  private contruirFormulario() {
    this.form = this.fb.group({
      idContratoCatalogo: [0],
      idTenant: [0],
      codigo: [null],
      titulo: ['', Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [null, Validators.required],
      situacao: [SituacaoContratoCatalogo['Em configuração'], Validators.required],
      tipoContratoCatalogo: [TipoContratoCatalogo.Padrão, Validators.required],
      estadosAtendimento: [null],
    });
  }

  private preencherFormulario(contrato: ContratoCatalogo) {

    this.form.patchValue(this.formateDados(contrato));
    this.idFornecedor = contrato.idFornecedor;
    this.idTenant = contrato.idTenant;
    this.validadeContrato = contrato.validadeContrato;
    this.form.disable();
    if (contrato.dataFimSeller == null) {
      this.form.controls.dataFim.enable();
    }
  }

  private valideInformacao() {

    const valido = true;

    if (this.form.controls.dataFim.value == this.contratoCatalogo.dataFim) {
      this.toastr.warning('Data informada não pode ser igual a data atual');

      return false;
    }

    if (this.form.controls.dataFim.value <= this.contratoCatalogo.dataInicio) {
      this.toastr.warning('Data informada não pode ser menor ou igual a data inicial do contrato');

      return false;
    }

    return valido;

  }
}
