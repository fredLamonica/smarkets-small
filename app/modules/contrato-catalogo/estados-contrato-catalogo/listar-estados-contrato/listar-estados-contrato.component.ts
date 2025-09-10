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
import { ContratoCatalogoItemEstado } from '../../../../shared/models/contrato-catalogo/contrato-catalogo-item-estado';
import { AnaliseAprovacaoCatalogo } from '../../../../shared/models/enums/analise-aprovacao-catalogo';
import { ContratoCatalogoEstadoFiltro } from '../../../../shared/models/fltros/contrato-catalogo-estado-filtro';
import { ContratoCatalogoService } from '../../../../shared/providers/contrato-catalogo.service';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'listar-estados-contrato',
  templateUrl: './listar-estados-contrato.component.html',
  styleUrls: ['./listar-estados-contrato.component.scss'],
})
export class ListarEstadosContratoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  // tslint:disable-next-line: no-input-rename
  @Input('id-contrato') idContrato: number;
  @Input('id-contrato-item') idContratoItem: number;

  Situacao = SituacaoContratoCatalogoItem;
  public colunasComIcone = new Array<IconeCustomTable>();

  settings: CustomTableSettings;
  estados: Array<ContratoCatalogoItemEstado> = new Array<ContratoCatalogoItemEstado>();
  estadosTotal: Array<ContratoCatalogoItemEstado> = new Array<ContratoCatalogoItemEstado>();
  selecionados: Array<ContratoCatalogoItemEstado>
  situacaoEstado = SituacaoContratoCatalogoItem;
  @Output() estadosItem: EventEmitter<Array<ContratoCatalogoItemEstado>> = new EventEmitter();
  analiseAprovacao = AnaliseAprovacaoCatalogo;

  estadosSelecionaveis: Array<Estado>;
  estadosSelecionaveisInicial: Array<Estado>;
  estadosSelecionaveisDBLocal: Array<Estado>;

  itensPorPagina: number = 5;
  totalPaginas: number;
  pagina: number = 1;
  ordenacao: Ordenacao = Ordenacao.DESC;
  itemOrdenar: string = 'ccie.IdContratoCatalogoItemEstado';
  contratoCatalogoEstadoFiltro: ContratoCatalogoEstadoFiltro = new ContratoCatalogoEstadoFiltro();

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
    this.contruirFormulario();
    this.construirTabelas();
    this.obtenhaEstadosDisponiveis();
    this.obterContratoEstados();
  }

  construirTabelas() {
    this.settings = new CustomTableSettings(
      [
        new CustomTableColumn('Estado', 'estado.nome', CustomTableColumnType.text),
        new CustomTableColumn('UF', 'estado.abreviacao', CustomTableColumnType.text),
        new CustomTableColumn(
          'Prazo de Entrega (em dias)',
          'prazoEntregaDias',
          CustomTableColumnType.text,
          null,
          null,
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

  selecao(estados: Array<ContratoCatalogoItemEstado>) {
    this.selecionados = estados;
  }

  paginacao(event) {
    this.pagina = event.page;
    this.itensPorPagina = event.recordsPerPage;
    this.preencherEstados();
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
    this.contratoService
      .alterarSituacaoEstadoContratoBatch(this.idContrato, this.selecionados, situacao)
      .pipe(
        takeUntil(this.unsubscribe))
      .subscribe(
        (resultado) => {
          this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
          this.blockUI.stop();
          this.obterContratoEstados();
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
      this.mapeieLocalEstado();
      this.limpeCamposFormulario();
      this.estadosItem.emit(this.estadosTotal);
      this.blockUI.stop();

    } else {
      this.toastr.warning(this.translationLibrary.translations.ALERTS.REQUIRED_FIELDS);
      this.blockUI.stop();
    }
  }

  private mapeieLocalEstado() {

    const estadoSelecionado = this.estadosSelecionaveis.find(x => x.idEstado === this.form.value.idEstado);

    const contratoEstado = new ContratoCatalogoItemEstado(
        this.idContrato,
        SituacaoContratoCatalogoItem['Aguardando Inclusão'],
        this.form.value.idEstado,
        this.form.value.prazoEntregaDias,
      );

    contratoEstado.idContratoCatalogoItemEstado = 0;
    contratoEstado.estado = estadoSelecionado;

    this.estadosTotal = [...this.estadosTotal, contratoEstado];

    if(this.estadosSelecionaveisDBLocal == undefined){
      this.estadosSelecionaveisDBLocal = new Array<Estado>();
    }

    this.estadosSelecionaveisDBLocal.push(estadoSelecionado);

    this.ordeneLista();
    this.preencherEstados();
  }

  private ordeneLista() {
    this.estadosTotal = [...this.estadosTotal.sort((a, b) => {
      if (a.estado.nome < b.estado.nome) {
        return -1;
      }

      if (a.estado.nome > b.estado.nome) {
        return 1;
      }

      return 0;
    }
    )];
  }

   get desabiliteBotaoQuandoInclusao(){
    return this.selecionados
           && this.selecionados.length > 0
           && this.selecionados.filter(x => x.situacao == SituacaoContratoCatalogoItem['Aguardando Inclusão']).length == 0 ? true : false;
  }


  private preencherEstados() {
    this.estados = new Array<ContratoCatalogoItemEstado>();

    const inicio = (this.pagina - 1) * this.itensPorPagina;
    const fim = this.pagina * this.itensPorPagina;

    this.estados = this.estadosTotal.slice(inicio, fim);
    this.totalPaginas = Math.ceil(this.estadosTotal.length / this.itensPorPagina);

    this.tratarEstados(this.estadosSelecionaveisDBLocal);
  }


  editar() {
    if (this.selecionados && this.selecionados.length === 1) {
      const estadoDeAtendimento = this.selecionados[0];

      this.modoEdicao = true;
      this.estadosSelecionaveis = [...this.estadosSelecionaveis, estadoDeAtendimento.estado];
      this.ordeneEstadosSelecionaveis();

      this.form.patchValue({
        idEstado: estadoDeAtendimento.idEstado,
        prazoEntregaDias: estadoDeAtendimento.prazoEntregaDias,
      });

      this.form.controls.idEstado.disable();
    }
  }

  salvar() {
    if (this.selecionados && this.selecionados.length === 1) {

      this.estadosTotal.forEach(x => {
        if(x.idEstado == this.selecionados[0].idEstado){
          x.prazoEntregaDias = this.form.value.prazoEntregaDias;
        }
      });
    }

    this.preencherEstados();
    this.limpeCamposFormulario();
    this.estadosItem.emit(this.estadosTotal);
  }

  private limpeCamposFormulario() {
    this.form.reset();
    this.form.controls.idEstado.enable();
    this.form.controls.prazoEntregaDias.setValue(1);
    this.modoEdicao = false;
  }

  private ordeneEstadosSelecionaveis() {
    this.estadosSelecionaveis.sort((obj1, obj2) => {
      if (obj1.nome > obj2.nome) { return 1; }
      if (obj1.nome < obj2.nome) { return -1; }
      return 0;
    });
  }

  private obtenhaEstadosDisponiveis(){
    if(this.idContratoItem){
      this.blockUI.start(this.translationLibrary.translations.LOADING);

      this.contratoService.obtenhaEstadosDisponiveis(this.idContratoItem).pipe(
        takeUntil(this.unsubscribe)
      ).subscribe(
        (response) => {
          if(response){
            this.estadosSelecionaveisDBLocal = response;
          }

          this.blockUI.stop();
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        }
      )
    }
  }

  private obterContratoEstados(termo: string = '') {

    this.contratoCatalogoEstadoFiltro.idContratoCatalogo = this.idContrato;
    this.contratoCatalogoEstadoFiltro.idContratoCatalogoItem = this.idContratoItem;
    this.contratoCatalogoEstadoFiltro.itensPorPagina = 27;
    this.contratoCatalogoEstadoFiltro.pagina = this.pagina;
    this.contratoCatalogoEstadoFiltro.termo = termo;
    this.contratoCatalogoEstadoFiltro.ordenacao = this.ordenacao;
    this.contratoCatalogoEstadoFiltro.itemOrdenar = this.itemOrdenar;
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    // idPais 30 = Brasil
    this.estadoService.obterEstados(30).pipe(
      takeUntil(this.unsubscribe),
      switchMap((estados) => {
        this.estadosSelecionaveis = estados;
        this.estadosSelecionaveisInicial = estados;

        return this.contratoService.filtrarEstadosContrato(this.contratoCatalogoEstadoFiltro).pipe(
          takeUntil(this.unsubscribe),
          map((response) => {
            if (response) {

              if(this.estadosSelecionaveisDBLocal){
                this.tratarEstados(this.estadosSelecionaveisDBLocal);
              }

              this.estadosTotal = [...response.itens];
              this.estados = [...response.itens];

              this.ordeneLista();
              this.estadosItem.emit(this.estadosTotal);
            }

            return response;
          }));
      }))
      .subscribe((response) => {
        if (response) {
           this.preencherEstados();
        } else {
          this.estados = new Array<ContratoCatalogoItemEstado>();
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

  private tratarEstados(estados: Array<Estado>) {
    this.estadosSelecionaveis = this.estadosSelecionaveis.filter((a) => !estados.find((b) => b.idEstado === a.idEstado));
  }

  private excluir() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    if(this.selecionados != null){

      this.estados = this.estados.filter(x => !this.selecionados.includes(x));
      this.estadosTotal = this.estadosTotal.filter(x => !this.selecionados.includes(x));
      this.estadosSelecionaveis = this.estadosSelecionaveisInicial;

      this.ordeneLista();
      this.preencherEstados();
      this.limpeCamposFormulario();
      this.estadosItem.emit(this.estadosTotal);

      this.blockUI.stop();
    }

    this.blockUI.stop();
  }

  private contruirFormulario() {
    this.form = this.formBuider.group({
      idEstado: [null, Validators.required],
      prazoEntregaDias: [
        1,
        Validators.compose([Validators.required, Validators.min(1), Validators.max(999999999)]),
      ],
    });
  }
}
