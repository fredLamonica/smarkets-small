import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Estado, Ordenacao, SituacaoContratoCatalogoItem } from '@shared/models';
import { EstadoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import { UtilitiesService } from '@shared/utils/utilities.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { IconeCustomTable } from '../../../../shared/models/coluna-custom-table/coluna-com-icone';
import { ContratoCatalogoFaturamento } from '../../../../shared/models/contrato-catalogo/contrato-catalogo-faturamento';
import { AprovacaoItemContratoFornecedor } from '../../../../shared/models/enums/aprovacao-item-contrato-fornecedor';
import { ContratoCatalogoEstadoFiltro } from '../../../../shared/models/fltros/contrato-catalogo-estado-filtro';
import { ContratoCatalogoFaturamentoFiltro } from '../../../../shared/models/fltros/contrato-catalogo-faturamento-filtro';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { EditeFaturamentoContratoFornecedorComponent } from './edite-faturamento-contrato-fornecedor/edite-faturamento-contrato-fornecedor.component';

@Component({
  selector: 'smk-liste-faturamento-contrato-fornecedor',
  templateUrl: './liste-faturamento-contrato-fornecedor.component.html',
  styleUrls: ['./liste-faturamento-contrato-fornecedor.component.scss'],
})
export class ListeFaturamentoContratoFornecedorComponent extends Unsubscriber implements OnInit {

  get getPermissaoEdicao() {
    return this.selecionados && this.selecionados.length == 1 && ![SituacaoContratoCatalogoItem['Aguardando Exclusão'], SituacaoContratoCatalogoItem['Aguardando Inclusão']].includes(this.selecionados[0].situacao) ? true : false;
  }

  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;
  public colunasComIcone = new Array<IconeCustomTable>();
  Situacao = SituacaoContratoCatalogoItem;
  @Output() possuiEdicao: EventEmitter<boolean> = new EventEmitter();

  settings: CustomTableSettings;
  estados: Array<ContratoCatalogoFaturamento>;
  selecionados: Array<ContratoCatalogoFaturamento>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.DESC;
  itemOrdenar: string = 'IdContratoCatalogoFaturamento';
  contratoCatalogoFaturamentoFiltro: ContratoCatalogoFaturamentoFiltro = new ContratoCatalogoEstadoFiltro();

  form: FormGroup;

  maskValor = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 2,
    requireDecimal: true,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9,
  });

  estadosSelecionaveis: Array<Estado>;
  modoEdicao: boolean;

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private estadoService: EstadoService,
    private formBuider: FormBuilder,
    private errorService: ErrorService,
    private utilitiesService: UtilitiesService,
  ) {
    super();
  }

  ngOnInit() {
    this.contruirFormulario();
    this.obterColunaIcone();
    this.construirTabelas();
    this.obterContratoFaturamento();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Estado', 'estado.nome', CustomTableColumnType.text),
        new CustomTableColumn('UF', 'estado.abreviacao', CustomTableColumnType.text),
        new CustomTableColumn(
          'Faturamento Mínimo',
          'valorMinimoPedido',
          CustomTableColumnType.text,
          'currency',
          'BRL:symbol:1.2:pt-BR',
        ),
        new CustomTableColumn(
          'Situação',
          'situacao',
          CustomTableColumnType.enum,
          null,
          null,
          SituacaoContratoCatalogoItem,
        ),
      ],
      'check',
    );
  }

  selecao(faturamentos: Array<ContratoCatalogoFaturamento>) {
    this.selecionados = faturamentos;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.obterContratoFaturamento();
  }

  solicitarExclusao() {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(),
        (reason) => { },
      );
  }

  alterarSituacao(situacao: SituacaoContratoCatalogoItem) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let idsContratoCatalogoFaturamento = this.selecionados.map(x => x.idContratoCatalogoFaturamento)

    this.contratoService
      .alterarSituacaoFaturamentoContratoBatch(idsContratoCatalogoFaturamento, situacao)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();

          this.obterContratoFaturamento();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  incluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (this.form.valid) {
      const valorMinimoPedido = this.utilitiesService.getNumberWithoutFormat(this.form.value.valorMinimoPedido);

      const contratoFaturamento = new ContratoCatalogoFaturamento(
        this.idContrato,
        SituacaoContratoCatalogoItem['Aguardando Inclusão'],
        this.form.value.idEstado,
        valorMinimoPedido,
      );

      this.contratoService.insereFaturamentoContrato(contratoFaturamento).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.estadosSelecionaveis = this.estadosSelecionaveis.filter((estado) => estado.idEstado !== contratoFaturamento.idEstado);
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.form.reset({ prazoEntregaDias: 1 });
            this.blockUI.stop();

            this.pagina = 1;
            this.obterContratoFaturamento();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  salvar() {
    if (this.selecionados && this.selecionados.length === 1) {

      const estadoDeAtendimento = this.selecionados[0];
      const valorMinimoPedido = this.utilitiesService.getNumberWithoutFormat(this.form.value.valorMinimoPedido);

      const contratoEstado = new ContratoCatalogoFaturamento(
        this.idContrato,
        SituacaoContratoCatalogoItem.Ativo,
        estadoDeAtendimento.idEstado,
        valorMinimoPedido,
        estadoDeAtendimento.idContratoCatalogoFaturamento
      );

      this.contratoService.altereFaturamentoContrato(contratoEstado).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.estadosSelecionaveis = this.estadosSelecionaveis.filter((estado) => estado.idEstado !== estadoDeAtendimento.idEstado);
            this.modoEdicao = false;
            this.form.reset({ prazoEntregaDias: 1 });
            this.pagina = 1;
            this.obterContratoFaturamento();
            this.form.controls.idEstado.enable();
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          });
    }
  }

  valideEstadosComAprovacao() {
    return this.selecionados.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']).length > 0 ? true : false;
  }

  private obterColunaIcone() {
    let colunaIcone = new IconeCustomTable();
    colunaIcone.title = 'Justificativa';
    colunaIcone.icone = 'fas fa-comment-dots'
    colunaIcone.textoTooltip = 'justificativaReprovacao'
    colunaIcone.tooltipClass = 'tooltip-light'

    this.colunasComIcone.push(colunaIcone);
  }

   edite() {
    const modalRef = this.modalService.open(EditeFaturamentoContratoFornecedorComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.idContratoCatalogoFaturamento = this.selecionados[0].idContratoCatalogoFaturamento;

    modalRef.result.then((result) => {
      if (result) {
        this.obterContratoFaturamento();
      }
    });
  }

  private ordeneEstadosSelecionaveis() {
    this.estadosSelecionaveis.sort((obj1, obj2) => {
      if (obj1.nome > obj2.nome) { return 1; }
      if (obj1.nome < obj2.nome) { return -1; }
      return 0;
    });
  }

  private obterContratoFaturamento(termo: string = '') {

    this.contratoCatalogoFaturamentoFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoFaturamentoFiltro.itensPorPagina = this.itensPorPagina;
    this.contratoCatalogoFaturamentoFiltro.pagina = this.pagina;
    this.contratoCatalogoFaturamentoFiltro.termo = termo;
    this.contratoCatalogoFaturamentoFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoFaturamentoFiltro.itemOrdenar = this.itemOrdenar;

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    // idPais 30 = Brasil
    this.estadoService.obterEstados(30).pipe(
      takeUntil(this.unsubscribe),
      switchMap((estados) => {
        this.estadosSelecionaveis = estados;

        return this.contratoService.filtrarFaturamentoContrato(this.contratoCatalogoFaturamentoFiltro).pipe(
          takeUntil(this.unsubscribe),
          map((response) => {
            if (response) {
              this.tratarFaturamentos(response.itens);
            }

            return response;
          }));
      }))
      .subscribe((response) => {
        if (response) {
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.estados = new Array<ContratoCatalogoFaturamento>();
          this.totalPaginas = 1;
        }
        this.blockUI.stop();
      },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }

  private tratarFaturamentos(estados: Array<ContratoCatalogoFaturamento>) {
    this.estados = estados;
    this.estadosSelecionaveis = this.estadosSelecionaveis.filter((a) => !estados.find((b) => b.idEstado === a.idEstado));

    this.TrateSituacao();
  }

  private TrateSituacao() {
    this.estados.forEach(x => {
      if (x.aprovacaoContratoCatalogoFaturamento != undefined
         && x.aprovacaoContratoCatalogoFaturamento.confirmado == false
         && x.aprovacaoContratoCatalogoFaturamento.situacao == AprovacaoItemContratoFornecedor.AguardandoAprovacao) {

        this.possuiEdicao.emit(true);

        return x.situacao = SituacaoContratoCatalogoItem['Em edição'];
      }
    });

  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    let idsFaturamento = this.selecionados.map(x => x.idContratoCatalogoFaturamento)

    if (!this.valideEstadosComAprovacao()) {
      this.contratoService.soliciteExclusaoFaturamento(this.idContrato, idsFaturamento).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (resultado) => {
            if (resultado) {
              this.selecionados.forEach((s) => this.estadosSelecionaveis = [...this.estadosSelecionaveis, s.estado]);
              this.ordeneEstadosSelecionaveis();
            }
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();

            this.pagina = 1;
            this.obterContratoFaturamento();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
    } else {
      this.toastr.warning('Não é possível remover o(s) estado(s) selecionado(s) pois existe(m) estado(s) aguardando aprovação!');
      this.blockUI.stop();
    }

  }

  private contruirFormulario() {
    this.form = this.formBuider.group({
      idEstado: [null, Validators.required],
      valorMinimoPedido: [null, Validators.required]
    });
  }
}
