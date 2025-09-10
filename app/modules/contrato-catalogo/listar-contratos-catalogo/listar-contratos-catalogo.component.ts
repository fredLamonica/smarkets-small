import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditoriaComponent, ConfirmacaoComponent, ModalConfirmacaoExclusao } from '@shared/components';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { ContratoCatalogo, CustomTableSettings, Estado, SituacaoContratoCatalogo } from '@shared/models';
import { ArquivoService, EstadoService, TranslationLibraryService } from '@shared/providers';
import { ErrorService } from '@shared/utils/error.service';
import * as moment from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { finalize, takeUntil } from 'rxjs/operators';
import { createNumberMask } from 'text-mask-addons';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../shared/components/data-list/table/models/table-pagination';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../shared/models/configuracao-filtro-usuario-dto';
import { ContratoCatalogoDto } from '../../../shared/models/contrato-catalogo/contrato-catalogo-dto';
import { ValidadeContratoCatalogo } from '../../../shared/models/enums/validade-contrato-catalogo';
import { ContratoCatalogoFiltro } from '../../../shared/models/fltros/contrato-catalogo-filtro';
import { PaginacaoPesquisaConfiguradaDto } from '../../../shared/models/paginacao-pesquisa-configurada-dto';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { TipoContratoCatalogo } from './../../../shared/models/enums/tipo-contrato-catalogo';
import { ContratoCatalogoService } from './../../../shared/providers/contrato-catalogo.service';

@Component({
  selector: 'app-listar-contratos-catalogo',
  templateUrl: './listar-contratos-catalogo.component.html',
  styleUrls: ['./listar-contratos-catalogo.component.scss'],
})
export class ListarContratosCatalogoComponent extends Unsubscriber implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  maskCnpj = [
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '.',
    /\d/,
    /\d/,
    /\d/,
    '/',
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    '-',
    /\d/,
    /\d/,
  ];

  formBuscaAvancada: FormGroup;
  readonly textoLimpar: string = 'Limpar';

  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<ContratoCatalogoDto>;
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  contratos: Array<ContratoCatalogoDto>;
  situacaoContratoCatalogo = SituacaoContratoCatalogo;
  opcoesSituacao: Array<{ index: number, name: string }>;
  opcoesTipoCatalogo: Array<{ index: number, name: string }>;
  opcoesValidade: Array<{ index: number, name: string }>;
  settings: CustomTableSettings;
  tipoContratoCatalogo = TipoContratoCatalogo;
  selecionados: Array<ContratoCatalogo>;
  validadeContratoCatalogo = ValidadeContratoCatalogo;
  estados: Estado[];
  filtro: ContratoCatalogoFiltro;
  contratoCatalogoSelecionado: ContratoCatalogoDto;
  paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<ContratoCatalogoDto>;

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

  private idPais = 30; //Brasil

  constructor(
    private translationLibrary: TranslationLibraryService,
    private contratoService: ContratoCatalogoService,
    private toastr: ToastrService,
    private arquivoService: ArquivoService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private errorService: ErrorService,
    private estadoService: EstadoService,
  ) { super() }

  ngOnInit() {
    this.obterEstados();
    this.obtenhaColunasDisponiveis();
    this.construirFormulario();
    this.filtreContratosNaInicializacao();
  }

  construirFormulario() {
    this.formBuscaAvancada = this.fb.group({
      cnpj: [''],
      razaoSocial: [''],
      dataInicio: [null],
      dataFim: [null],
      situacao: [''],
      idContratoCatalogo: [''],
      tipoContratoCatalogo: [null],
      responsavel: [''],
      gestor: [''],
      codigo: [''],
      objeto: [''],
      uf: [null],
      faturamentoMinimo: [''],
      validade: [''],
    });

    this.opcoesSituacao = new EnumToArrayPipe().transform(SituacaoContratoCatalogo) as Array<any>;
    this.opcoesTipoCatalogo= new EnumToArrayPipe().transform(TipoContratoCatalogo) as Array<any>;
    this.opcoesValidade = new EnumToArrayPipe().transform(ValidadeContratoCatalogo) as Array<any>;

    this.formBuscaAvancada.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((valores) => {
        this.filtro = { ...this.filtro, ...valores };
    });
  }

  get desabiliteBotaoAtivar() {
    return (
      this.contratoCatalogoSelecionado.situacao === SituacaoContratoCatalogo['Pendente de Aprovação'] ||
      (this.contratoCatalogoSelecionado.situacao === SituacaoContratoCatalogo['Em configuração'] &&
        this.contratoCatalogoSelecionado.tipoContratoCatalogo === TipoContratoCatalogo.Automático)
    );
  }

  // #region Ações

  solicitarExclusao(idContratoCatalogo: number) {
    const modalRef = this.modalService
      .open(ModalConfirmacaoExclusao, { centered: true })
      .result.then(
        (result) => this.excluir(idContratoCatalogo),
        (reason) => { },
      );
  }

  auditar(idContratoCatalogo: number) {
    const modalRef = this.modalService.open(AuditoriaComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.nomeClasse = 'ContratoCatalogo';
    modalRef.componentInstance.idEntidade = idContratoCatalogo;
  }

  ativar(contrato: ContratoCatalogoDto) {
    if (this.validaAtivacao(contrato)) {
      const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
      modalRef.componentInstance.confirmacao = 'Tem certeza que deseja ativar o contrato?';
      modalRef.result.then((result) => {
        if (result) {
          this.blockUI.start(this.translationLibrary.translations.LOADING);
          this.contratoService.ativar(contrato).subscribe(
            (response) => {
              this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
              this.blockUI.stop();
              this.obterContratos(false);
            },
            (error) => {
              this.errorService.treatError(error);
              this.blockUI.stop();
            },
          );
        }
      });
    }
  }

  inativar(contrato: ContratoCatalogoDto) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });
    modalRef.componentInstance.confirmacao = 'Tem certeza que deseja desativar o contrato?';
    modalRef.result.then((result) => {
      if (result) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.contratoService.inativar(contrato).subscribe(
          (response) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            this.obterContratos(false);
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
      }
    });
  }

  cloneCatalogo(idContratoCatalogo: number) {
    const modalRef = this.modalService.open(ConfirmacaoComponent, {
      centered: true
    });
    modalRef.componentInstance.confirmacao = 'Deseja clonar este catálogo?';
    modalRef.componentInstance.confirmarLabel = 'Clonar';
    modalRef.componentInstance.cancelarLabel = 'Voltar';
    modalRef.result.then(result => {
      if (result) {
        this.blockUI.start(this.translationLibrary.translations.LOADING);
        this.contratoService.cloneCatalogo(idContratoCatalogo).subscribe(
          (result) => {
            this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
            this.blockUI.stop();
            location.reload();
          },
          (error) => {
            this.errorService.treatError(error);
            this.blockUI.stop();
          },
        );
      }
    });
  }

  public obterContratos(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false) {
    this.inicieLoading();

    if (resetarPagina) {
      this.filtro.pagina = 1;
    }

    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.filtrar(this.filtro)
      .subscribe(
        (paginacaoPesquisaConfigurada) => {
          this.selecione(null);
          this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
          this.configureGrid();

          if (emitirToastrDeSucesso) {
            this.emitirToastrDeSucesso();
          }

          this.blockUI.stop();
        },
        (error) => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        },
      );
  }

  private excluir(idContratoCatalogo: number) {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.contratoService.deletar(idContratoCatalogo).subscribe(
      (resultado) => {
        this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
        this.obterContratos(false);
        this.blockUI.stop();
      },
      (error) => {
        this.errorService.treatError(error);
        this.blockUI.stop();
      },
    );
  }

  selecione(contratos: Array<ContratoCatalogoDto>): void {
    this.contratoCatalogoSelecionado = contratos && contratos instanceof Array && contratos.length > 0 ? contratos[0] : undefined;
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.obterContratos(false);
  }

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  origensSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }

  filtre(): void {
    this.obterContratos(false, true);
  }

  limpeFiltro(): void {
    this.formBuscaAvancada.reset();
    this.obterContratos(false, true);
  }

  private validaAtivacao(contrato: ContratoCatalogoDto): boolean {
    const dataFimContrato = this.datePipe.transform(contrato.dataFim, 'yyyy-MM-dd');
    const today = moment().format('YYYY-MM-DD');

    if (dataFimContrato < today) {
      this.toastr.warning('Não é possível ativar um contrato vencido');
      return false;
    }

    return true;
  }

  private configureGrid(): void {
      this.configuracaoDaTable = new TableConfig<ContratoCatalogoDto>({
        page: this.filtro.pagina,
        pageSize: this.filtro.itensPorPagina,
        totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
        totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
      });
    }

  private obterEstados() {
    this.estadoService.obterEstados(this.idPais).subscribe(
      response => {
        if (response) {
          this.estados = response;
        } else {
          this.estados = new Array<Estado>();
        }
      },
      error => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
      }
    );
  }

  private obtenhaColunasDisponiveis(): void {
    this.contratoService.obtenhaColunasDiponiveis(false).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private inicieLoading(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

   private filtreContratosNaInicializacao(): void {
    this.inicieLoading();

    this.contratoService.obtenhaFiltroSalvoCliente().pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: ContratoCatalogoFiltro) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5 };
          this.formBuscaAvancada.patchValue(this.filtro);
          this.obterContratos(false);
        },
        (error) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  exporte(): void {
    this.inicieLoading();

    this.contratoService.exporte(this.filtro).pipe(
      takeUntil(this.unsubscribe),
      finalize(() => this.blockUI.stop()))
      .subscribe(
        (response) => {
          this.arquivoService.createDownloadElement(
            response,
            `Relatório de Pedidos ${this.filtro.dataInicio} a ${this.filtro.dataFim}.xls`,
          );

          this.emitirToastrDeSucesso();
        },
        (error) => this.errorService.treatError(error));
  }

  // #endregion
}
