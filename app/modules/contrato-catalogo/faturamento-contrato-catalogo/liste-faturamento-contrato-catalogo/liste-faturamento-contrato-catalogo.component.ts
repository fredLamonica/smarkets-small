import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { ModalConfirmacaoExclusao } from '../../../../shared/components';
import { Unsubscriber } from '../../../../shared/components/base/unsubscriber';
import { RecusaAprovacaoContratoFornecedorComponent } from '../../../../shared/components/modals/recusa-aprovacao-contrato-fornecedor/recusa-aprovacao-contrato-fornecedor.component';
import { CustomTableColumn, CustomTableColumnType, CustomTableSettings, Estado, Ordenacao, SituacaoContratoCatalogoItem } from '../../../../shared/models';
import { IconeCustomTable } from '../../../../shared/models/coluna-custom-table/coluna-com-icone';
import { ContratoCatalogoFaturamento } from '../../../../shared/models/contrato-catalogo/contrato-catalogo-faturamento';
import { AnaliseAprovacaoCatalogo } from '../../../../shared/models/enums/analise-aprovacao-catalogo';
import { AprovacaoItemContratoFornecedor } from '../../../../shared/models/enums/aprovacao-item-contrato-fornecedor';
import { ContratoCatalogoFaturamentoFiltro } from '../../../../shared/models/fltros/contrato-catalogo-faturamento-filtro';
import { EstadoService, TranslationLibraryService } from '../../../../shared/providers';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';
import { ErrorService } from '../../../../shared/utils/error.service';
import { UtilitiesService } from '../../../../shared/utils/utilities.service';
import { ReajusteFaturamentoContratoCatalogoComponent } from '../reajuste-faturamento-contrato-catalogo/reajuste-faturamento-contrato-catalogo.component';

@Component({
  selector: 'smk-liste-faturamento-contrato-catalogo',
  templateUrl: './liste-faturamento-contrato-catalogo.component.html',
  styleUrls: ['./liste-faturamento-contrato-catalogo.component.scss']
})
export class ListeFaturamentoContratoCatalogoComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;

  Situacao = SituacaoContratoCatalogoItem;
  public colunasComIcone = new Array<IconeCustomTable>();

  settings: CustomTableSettings;
  faturamentos: Array<ContratoCatalogoFaturamento> = new Array<ContratoCatalogoFaturamento>();
  faturamentossTotal: Array<ContratoCatalogoFaturamento> = new Array<ContratoCatalogoFaturamento>();
  selecionados: Array<ContratoCatalogoFaturamento>
  situacaoFaturamento = SituacaoContratoCatalogoItem;
  @Output() possuiAprovacao: EventEmitter<boolean> = new EventEmitter();
  @Output() possuiInclusaoExclusao: EventEmitter<boolean> = new EventEmitter();

  analiseAprovacao = AnaliseAprovacaoCatalogo;
  estadosSelecionaveisInicial: Array<Estado>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.DESC;
  itemOrdenar: string = 'IdContratoCatalogoFaturamento';
  contratoCatalogoEstadoFiltro: ContratoCatalogoFaturamentoFiltro = new ContratoCatalogoFaturamentoFiltro();

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
  modoEdicao: boolean = false;

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
    this.construirTabelas();
    this.obterContratoFaturamento();
    this.contruirFormulario();
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

  selecao(estados: Array<ContratoCatalogoFaturamento>) {
    this.selecionados = estados;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
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

    let idsContratoCatalogoFaturamento = this.selecionados.map(x => x.idContratoCatalogoFaturamento);

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

  reajusteItem() {
    const modalRef = this.modalService.open(ReajusteFaturamentoContratoCatalogoComponent, {
      centered: true,
      size: 'lg',
    });

    modalRef.componentInstance.idContratoCatalogoFaturamento= this.selecionados[0].idContratoCatalogoFaturamento;

    modalRef.result.then((result) => {
      if (result) {
        this.obterContratoFaturamento();
      }
    });
  }

  incluir() {
     this.blockUI.start(this.translationLibrary.translations.LOADING);

    if (this.form.valid) {

      const valorMinimoPedido = this.utilitiesService.getNumberWithoutFormat(this.form.value.valorMinimoPedido);
      const contratoEstado = new ContratoCatalogoFaturamento(
          this.idContrato,
          SituacaoContratoCatalogoItem.Ativo,
          this.form.value.idEstado,
          valorMinimoPedido,
          null
      );

      this.contratoService.insereFaturamentoContrato(contratoEstado).pipe(
        takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.estadosSelecionaveis = this.estadosSelecionaveis.filter((estado) => estado.idEstado !== contratoEstado.idEstado);
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


  editar() {
    if (this.selecionados && this.selecionados.length === 1) {
      const estadoDeAtendimento = this.selecionados[0];

      this.modoEdicao = true;
      this.estadosSelecionaveis = [...this.estadosSelecionaveis, estadoDeAtendimento.estado];
      this.ordeneEstadosSelecionaveis();

      this.form.patchValue({
        idEstado: estadoDeAtendimento.idEstado,
        valorMinimoPedido: estadoDeAtendimento.valorMinimoPedido.toString().replace('.', ','),
      });

      this.form.controls.idEstado.disable();
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
            this.pagina = 1;

            this.form.reset();
            this.form.controls.idEstado.enable();

            this.obterContratoFaturamento();

            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          });
    }
  }

  private ordeneEstadosSelecionaveis() {
    this.estadosSelecionaveis.sort((obj1, obj2) => {
      if (obj1.nome > obj2.nome) { return 1; }
      if (obj1.nome < obj2.nome) { return -1; }
      return 0;
    });
  }

  private obterContratoFaturamento(termo: string = '') {

    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoCatalogoEstadoFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoEstadoFiltro.itensPorPagina = this.itensPorPagina;
    this.contratoCatalogoEstadoFiltro.pagina = this.pagina;
    this.contratoCatalogoEstadoFiltro.termo = termo;
    this.contratoCatalogoEstadoFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoEstadoFiltro.itemOrdenar = this.itemOrdenar;

    // idPais 30 = Brasil
    this.estadoService.obterEstados(30).pipe(
      takeUntil(this.unsubscribe),
      switchMap((estados) => {
        this.estadosSelecionaveis = estados;

        return this.contratoService.filtrarFaturamentoContrato(this.contratoCatalogoEstadoFiltro).pipe(
          takeUntil(this.unsubscribe),
          map((response) => {
            if (response) {

              this.faturamentos = response.itens;
              this.tratarEstados(response.itens);
              this.possuiFaturamentosEmAprovacao();
            }

            return response;
          }));
      }))
      .subscribe((response) => {
        if (response) {
          this.totalPaginas = response.numeroPaginas;
        } else {
          this.faturamentos = new Array<ContratoCatalogoFaturamento>();
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

  private tratarEstados(estados: Array<ContratoCatalogoFaturamento>) {
    this.estadosSelecionaveis = this.estadosSelecionaveis.filter((a) => !estados.find((b) => b.idEstado === a.idEstado));
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.deleteFaturamentoContratoBatch(this.idContrato, this.selecionados).pipe(
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
  }

  private contruirFormulario() {
    this.form = this.formBuider.group({
      idEstado: [null, Validators.required],
      valorMinimoPedido: [null, Validators.required],
    });
  }

  get exibeAprovacao(){
    return  this.selecionados && this.selecionados.length == 1 && this.selecionados[0].situacao == this.situacaoFaturamento['Aguardando Aprovação'] ? true : false;
  }

  get desabiliteBotaoQuandoAprovacao(){
    return this.selecionados
           && this.selecionados.length > 0
           && this.selecionados.filter(x =>
           [SituacaoContratoCatalogoItem['Aguardando Aprovação'], SituacaoContratoCatalogoItem.Aprovado, SituacaoContratoCatalogoItem.Recusado]
           .includes(x.situacao)).length == 0 ? true : false;
  }


  get desabiliteBotaoAprovacao(){
    return this.faturamentos && this.faturamentos.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']).length ? false : true;
  }

  analiseFaturamentos(aprovacao: AnaliseAprovacaoCatalogo){
    let estados = this.faturamentos.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']);

    if(aprovacao == AnaliseAprovacaoCatalogo.aprovado)
      this.analiseAprovacaoFaturamento(aprovacao, estados)
    else
      this.recuseAprovacaoFaturamento(estados)
  }

   recuseAprovacaoFaturamento(faturamentos: ContratoCatalogoFaturamento[]) {
    const modalMotivoRecusa = this.modalService.open(RecusaAprovacaoContratoFornecedorComponent, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });

    modalMotivoRecusa.result.then(
      (result) => {
        if (result) {
          faturamentos.forEach(x => {
            x.aprovacaoContratoCatalogoFaturamento.justificativa =  result.value
          });

          this.analiseAprovacaoFaturamento(AnaliseAprovacaoCatalogo.reprovado, faturamentos)
        }
      },
      (error) => {
        this.errorService.treatError(error);
      }
    );
  }

  private possuiFaturamentosEmAprovacao(){
    let faturamentosEmAprovacao = this.faturamentos.filter(x => (x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']));
    let faturamentosEmInclusaoOuExclusao = this.faturamentos.filter(x => ([SituacaoContratoCatalogoItem['Aguardando Inclusão'], SituacaoContratoCatalogoItem['Aguardando Exclusão']].includes(x.situacao)));

    this.faturamentos.forEach(x => {
      if(x.aprovacaoContratoCatalogoFaturamento
        && x.aprovacaoContratoCatalogoFaturamento.aprovado == AnaliseAprovacaoCatalogo.aprovado
        && x.aprovacaoContratoCatalogoFaturamento.situacao == AprovacaoItemContratoFornecedor.AguardandoAprovacao){
        x.situacao = SituacaoContratoCatalogoItem.Aprovado
      }

      if(x.aprovacaoContratoCatalogoFaturamento
        && x.aprovacaoContratoCatalogoFaturamento.aprovado == AnaliseAprovacaoCatalogo.reprovado
        && x.aprovacaoContratoCatalogoFaturamento.situacao == AprovacaoItemContratoFornecedor.AguardandoAprovacao){
        x.situacao = SituacaoContratoCatalogoItem.Recusado
      }
    })

    if(faturamentosEmAprovacao.length == 0){
      this.possuiAprovacao.emit(false)
    }

    if(faturamentosEmInclusaoOuExclusao.length == 0){
      this.possuiInclusaoExclusao.emit(false)
    }
  }

  get exibeBotaoAprovacao(){
    return this.faturamentos && this.faturamentos.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Aprovação']).length ? false : true;
  }

  analiseAprovacaoFaturamento(aprovacao: AnaliseAprovacaoCatalogo, faturamentos: ContratoCatalogoFaturamento[]){
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.contratoService.analiseAprovacaoFaturamento(aprovacao, faturamentos)
      .subscribe(
        (resultado) => {
          this.obterContratoFaturamento();
          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        },
      );
  }
}
