import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { BlockUIInstanceService } from 'ng-block-ui/lib/services/block-ui-instance.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { ModalConfirmacaoExclusao } from '..';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings } from '../../models';
import { ConfiguracoesEntregasProgramadas } from '../../models/configuracoes-entregas-programadas';
import { EntregaProgramada } from '../../models/entrega-programada';
import { ModoModal } from '../../models/enums/modo-modal.enum';
import { OrigemProgramacaoDeEntrega } from '../../models/enums/origem-programacao-de-entrega.enum';
import { EntregasProgramadasService } from '../../models/interfaces/entregas-programadas-service';
import { TranslationLibraryService } from '../../providers';
import { PedidoEntregasProgramadasService } from '../../providers/pedido-entregas-programadas.service';
import { RequisicaoEntregasProgramadasService } from '../../providers/requisicao-entregas-programadas.service';
import { ErrorService } from '../../utils/error.service';
import { UtilitiesService } from '../../utils/utilities.service';
import { dateRangeValidator } from '../../validators/date-range.validator';
import { decimalRequiredValidator } from '../../validators/decimal-required.validator';
import { validDateValidator } from '../../validators/valid-date.validator';
import { Unsubscriber } from '../base/unsubscriber';

@Component({
  selector: 'app-manter-entregas-programadas',
  templateUrl: './manter-entregas-programadas.component.html',
  styleUrls: ['./manter-entregas-programadas.component.scss'],
})
export class ManterEntregasProgramadasComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input() config: ConfiguracoesEntregasProgramadas;

  @Output() entregasChange = new EventEmitter<Array<EntregaProgramada>>();
  @Output() entregasLoad = new EventEmitter<Array<EntregaProgramada>>();

  blockUIComponentBody: NgBlockUI;
  blockUIComponentBodyName: string;
  origemProgramacaoDeEntrega = OrigemProgramacaoDeEntrega;
  entregas: Array<EntregaProgramada>;
  tableSettings: CustomTableSettings;
  entregasSelecionadas: Array<EntregaProgramada>;
  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  form: FormGroup;
  modoEdicao: boolean;
  modoCollapsed: boolean;
  quantidadeTotal: number;

  private valorInicial: string = '0,00';
  private dataDeEntregaValidators: ValidatorFn;
  private dataDeEntregaPassadaValidators: ValidatorFn;

  constructor(
    private formBuider: FormBuilder,
    private modalService: NgbModal,
    private translationLibrary: TranslationLibraryService,
    private utilitiesService: UtilitiesService,
    private toastr: ToastrService,
    private errorService: ErrorService,
    private requisicaoEntregasProgramadasService: RequisicaoEntregasProgramadasService,
    private pedidoEntregasProgramadasService: PedidoEntregasProgramadasService,
    private blockUIInstanceService: BlockUIInstanceService,
    private activeModal: NgbActiveModal,
  ) {
    super();
  }

  ngOnInit() {
    if (!this.config.dataEntregaMinima) {
      this.config.dataEntregaMinima = moment().format('YYYY-MM-DD');
    }

    this.inicializeValidators();
    this.contruaFormulario();
    this.configureCustomTable();
    this.populeEntregas(false, true);
    this.configureBlockUiComponentBody();
  }

  toggleCollapse() {
    this.modoCollapsed = !this.modoCollapsed;
    this.resetForm();
    this.configureCustomTable();
  }

  configureCustomTable() {
    const columns = this.config.modoModal !== ModoModal.reduzido
      ? [
        new CustomTableColumn('Data de Entrega', 'dataEntrega', CustomTableColumnType.text, 'date', 'dd/MM/yyyy'),
        new CustomTableColumn(this.config.origem === OrigemProgramacaoDeEntrega.pedido ? 'Valor Unitário' : 'Valor de Referência', 'valor', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
        new CustomTableColumn('Quantidade', 'quantidade', CustomTableColumnType.text, this.config.permiteQuantidadeFracionada ? 'decimal' : null, this.config.permiteQuantidadeFracionada ? '1.0-4:pt-BR' : null),
        new CustomTableColumn('Valor Total', 'valorTotal', CustomTableColumnType.text, 'currency', 'BRL:symbol:1.2:pt-BR'),
      ]
      : [
        new CustomTableColumn('Data de Entrega', 'dataEntrega', CustomTableColumnType.text, 'date', 'dd/MM/yyyy'),
        new CustomTableColumn('Quantidade', 'quantidade', CustomTableColumnType.text, this.config.permiteQuantidadeFracionada ? 'decimal' : null, this.config.permiteQuantidadeFracionada ? '1.0-4:pt-BR' : null),
      ];

    this.tableSettings = new CustomTableSettings(
      columns,
      this.config.modoModal || this.modoCollapsed ? 'none' : 'check',
    );

  }

  selecao(entregas: Array<EntregaProgramada>) {
    this.entregasSelecionadas = entregas;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.populeEntregas(true);
  }

  confirmeExclusao() {
    this.modalService.open(ModalConfirmacaoExclusao, { centered: true, backdrop: 'static' })
      .result.then(
        (result) => this.exclua(),
        (reason) => { },
      );
  }

  inclua() {
    if (this.form.valid) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      const entregaProgramada = this.obtenhaEntregaProgramadaComBaseNoForm();

      this.service().post(entregaProgramada).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          () => {
            this.callbackSucesso();
          },
          (error) => {
            this.errorService.treatError(error);
          },
        );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
    }
  }

  edite() {
    if (this.entregasSelecionadas && this.entregasSelecionadas.length === 1) {
      const entregaProgramada = this.entregasSelecionadas[0];

      this.modoEdicao = true;

      if (moment(entregaProgramada.dataEntrega).isBefore(moment(this.config.dataEntregaMinima))) {
        this.definaValidatorsParaDataDeEntrega(this.dataDeEntregaPassadaValidators);
      }

      this.form.patchValue({
        id: entregaProgramada.id,
        idItem: entregaProgramada.idItem,
        dataEntrega: moment(entregaProgramada.dataEntrega).format('YYYY-MM-DD'),
        valor: entregaProgramada.valor.toString().replace('.', ','),
        quantidade: entregaProgramada.quantidade,
        valorTotal: entregaProgramada.valorTotal,
      });

      this.utilitiesService.markControlAsDirty(this.form);
    }
  }

  salve() {
    if (this.entregasSelecionadas && this.entregasSelecionadas.length === 1) {
      if (this.form.valid) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);

        const entregaProgramada = this.obtenhaEntregaProgramadaComBaseNoForm();

        this.service().put(entregaProgramada).pipe(
          takeUntil(this.unsubscribe),
          finalize(() => this.blockUI.stop()))
          .subscribe(
            () => {
              this.callbackSucesso();
            },
            (error) => {
              this.errorService.treatError(error);
            });
      } else {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      }
    }
  }

  resetForm() {
    this.form.reset({
      idItem: this.config.idItem,
      quantidade: this.config.quantidadeMinima,
      valor: this.obtenhaValorDefault(),
    });

    this.definaValidatorsParaDataDeEntrega(this.dataDeEntregaValidators);

    this.modoEdicao = false;
  }

  fecheModal() {
    this.activeModal.close();
  }

  private inicializeValidators() {
    this.dataDeEntregaValidators = Validators.compose([Validators.required, validDateValidator(), dateRangeValidator(this.config.dataEntregaMinima)]);
    this.dataDeEntregaPassadaValidators = Validators.compose([Validators.required, validDateValidator()]);
  }

  private definaValidatorsParaDataDeEntrega(validators: ValidatorFn) {
    this.form.get('dataEntrega').clearValidators();
    this.form.get('dataEntrega').setValidators(validators);
  }

  private configureBlockUiComponentBody() {
    this.blockUIComponentBodyName = `component-body${this.config.index}`;
    this.blockUIComponentBody = this.blockUIInstanceService.decorate(this.blockUIComponentBodyName);
  }

  private populeEntregas(ehPaginacao: boolean = false, ehCarga: boolean = false) {
    if (ehPaginacao) {
      this.blockUIComponentBody.start(this.translationLibrary.translations.LOADING);
    } else {
      this.blockUI.start(this.translationLibrary.translations.LOADING);
    }

    if (!ehPaginacao) {
      this.notifiqueTodasEntregas(ehCarga);
    }

    this.service().get(this.config.idItem, this.itensPorPagina, this.pagina).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => {
        if (ehPaginacao) {
          this.blockUIComponentBody.stop();
        } else {
          this.blockUI.stop();
        }
      }))
      .subscribe(
        (paginacao) => {
          if (paginacao) {
            this.totalPaginas = paginacao.numeroPaginas;
            this.entregas = paginacao.itens;
            if (this.config.valorPropostaFornecedor) {
              this.entregas.forEach((p) => p.valor = this.config.valorPropostaFornecedor);
            }
          } else {
            this.entregas = new Array<EntregaProgramada>();
            this.totalPaginas = 1;
          }
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        },
      );
  }

  private notifiqueTodasEntregas(ehCarga: boolean = false) {
    this.service().get(this.config.idItem, 999, 1).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (paginacao) => {
          let entregas = new Array<EntregaProgramada>();

          this.quantidadeTotal = 0;

          if (paginacao) {
            entregas = paginacao.itens;

            for (const entregaProgramada of entregas) {
              this.quantidadeTotal += entregaProgramada.quantidade;
            }
          }

          const todasAsEntregas = entregas.map((x) => x.flatOut());

          if (ehCarga) {
            this.entregasLoad.emit(todasAsEntregas);
          } else {
            this.entregasChange.emit(todasAsEntregas);
          }
        },
      );
  }

  private exclua() {
    if (this.entregasSelecionadas && this.entregasSelecionadas.length > 0) {
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.service().delete(this.entregasSelecionadas.map((entrega) => entrega.id)).pipe(
        takeUntil(this.unsubscribe),
        finalize(() => this.blockUI.stop()))
        .subscribe(
          () => {
            this.callbackSucesso(false);
          },
          (error) => {
            this.errorService.treatError(error);
          },
        );
    }
  }

  private contruaFormulario() {
    this.form = this.formBuider.group({
      id: [''],
      idItem: [this.config.idItem],
      dataEntrega: ['', this.dataDeEntregaValidators],
      valor: [this.obtenhaValorDefault(), this.config.empresaComIntegracaoErp ? decimalRequiredValidator() : []],
      quantidade: [this.config.quantidadeMinima, Validators.compose([Validators.required, Validators.min(this.config.quantidadeMinima), Validators.max(this.config.quantidadeMaxima)])],
      valorTotal: [0],
    });

    this.form.controls.valor.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((valor) => this.calculeDefinindoValorTotal(this.utilitiesService.getNumberWithoutFormat(valor), +this.form.value.quantidade));

    this.form.controls.quantidade.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((quantidade) => this.calculeDefinindoValorTotal(this.utilitiesService.getNumberWithoutFormat(this.form.value.valor), +quantidade));
  }

  private calculeDefinindoValorTotal(valor: number, quantidade: number) {
    this.form.controls.valorTotal.patchValue(valor * quantidade);
  }

  private obtenhaEntregaProgramadaComBaseNoForm(): EntregaProgramada {
    const valorSemFormatacao = this.utilitiesService.getNumberWithoutFormat(this.form.value.valor);

    const entregaProgramada = this.form.value as EntregaProgramada;
    entregaProgramada.valor = valorSemFormatacao;

    if (!entregaProgramada.valorTotal) {
      entregaProgramada.valorTotal = entregaProgramada.valor * entregaProgramada.quantidade;
    }

    return entregaProgramada;
  }

  private callbackSucesso(resetForm: boolean = true) {
    if (resetForm) {
      this.resetForm();
    }

    this.pagina = 1;
    this.populeEntregas();
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

  private obtenhaValorDefault() {
    return this.config.valorFixo ? this.config.valorFixo : this.valorInicial;
  }

  private service(): EntregasProgramadasService {
    return this.config.origem === OrigemProgramacaoDeEntrega.pedido
      ? this.pedidoEntregasProgramadasService
      : this.requisicaoEntregasProgramadasService;
  }

}
