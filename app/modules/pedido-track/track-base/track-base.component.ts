import { OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { now } from 'moment';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ConfirmacaoComponent } from '../../../shared/components';
import { Unsubscriber } from '../../../shared/components/base/unsubscriber';
import { SelectionModeEnum } from '../../../shared/components/data-list/models/selection-mode.enum';
import { TableConfig } from '../../../shared/components/data-list/table/models/table-config';
import { TablePagination } from '../../../shared/components/data-list/table/models/table-pagination';
import { TableStyleEnum } from '../../../shared/components/data-list/table/models/table-style.enum';
import { Ferramenta } from '../../../shared/components/funcionalidade/smk-table-funcionalidade/models/ferramenta';
import { Arquivo } from '../../../shared/models';
import { ConfiguracaoColunaDto } from '../../../shared/models/configuracao-coluna-dto';
import { ConfiguracaoFiltroUsuarioDto } from '../../../shared/models/configuracao-filtro-usuario-dto';
import { FuncionalidadeConfiguracaoUsuario } from '../../../shared/models/enums/funcionalidade-configuracao-usuario.enum';
import { ImportType } from '../../../shared/models/enums/ImportType.enum';
import { OrigemPedidoTrack } from '../../../shared/models/enums/Track/origem-pedido-track';
import { SituacaoAceitePedidoTrack } from '../../../shared/models/enums/Track/situacao-aceite-pedido-track';
import { SituacaoNotificacaoTrack } from '../../../shared/models/enums/Track/situacao-notificacao-track';
import { SituacaoPedidoTrack } from '../../../shared/models/enums/Track/situacao-pedido-track';
import { TipoOperacaoTrack } from '../../../shared/models/enums/Track/tipo-operacao-track';
import { FiltroBase } from '../../../shared/models/fltros/base/filtro-base';
import { ParadaManutencaoFiltroDto as PedidoTrackFiltroDto } from '../../../shared/models/fltros/track/parada-manutencao-filtro-dto';
import { PaginacaoPesquisaConfiguradaDto } from '../../../shared/models/paginacao-pesquisa-configurada-dto';
import { PedidoTrackDto } from '../../../shared/models/pedido-track/pedido-track-dto';
import { EnumToArrayPipe } from '../../../shared/pipes';
import { ArquivoService, TranslationLibraryService } from '../../../shared/providers';
import { ImportacaoModeloService } from '../../../shared/providers/importacao-modelo.service';
import { ImportacaoTrackService } from '../../../shared/providers/track/importacao-track-service';
import { PedidoTrackService } from '../../../shared/providers/track/pedido-track.service';
import { ErrorService } from '../../../shared/utils/error.service';
import { ManterFupCamposComponent } from '../track-campos/manter-fup-campos/manter-fup-campos.component';
import { ManterFupComponent } from '../track-campos/manter-fup/manter-fup.component';
import { AutenticacaoService } from './../../../shared/providers/autenticacao.service';

export abstract class TrackBaseComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  readonly textoLoading: string = 'Buscando...';
  readonly textoLimpar: string = 'Limpar';

  pedidosTrackSelecionados: PedidoTrackDto[];
  configuracaoFiltrosUsuario: ConfiguracaoFiltroUsuarioDto;
  filtroInformado: boolean = false;
  paginacaoPesquisaConfigurada?: PaginacaoPesquisaConfiguradaDto<PedidoTrackDto>;
  colunasDisponiveis: Array<ConfiguracaoColunaDto>;
  configuracaoDaTable: TableConfig<PedidoTrackDto>;
  opcoesSituacao: Array<{ index: number, name: string }>;
  opcoesOrigem: Array<{ index: number, name: string }>;
  permiteAvancarStatus: boolean = false;
  permiteEditar: boolean = false;
  permiteReenviarNotificacao: boolean = false;

  filtro = { pagina: 1, itensPorPagina: 5 } as PedidoTrackFiltroDto;
  formFiltro: FormGroup;
  mascaraSomenteNumeros = RegExp('\[0-9\]');

  ferramentas: Array<Ferramenta> = new Array<Ferramenta>();

  origemPedidoTrackEnum = OrigemPedidoTrack;
  situacaoPedidoEnum = SituacaoPedidoTrack;
  situacaoAceitePedidoEnum = SituacaoAceitePedidoTrack;
  situacaoNotificacaoEnum = SituacaoNotificacaoTrack;
  idTenant: number;

  protected abstract tipoOperacao: TipoOperacaoTrack;
  protected abstract funcionalidade: FuncionalidadeConfiguracaoUsuario;
  protected abstract descricaoFuncionalidade: string;

  constructor(
    protected toastr: ToastrService,
    protected fb: FormBuilder,
    protected translationLibrary: TranslationLibraryService,
    protected importacaoService: ImportacaoTrackService,
    protected errorService: ErrorService,
    protected arquivoService: ArquivoService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected pedidoTrackService: PedidoTrackService,
    protected autenticacaoService: AutenticacaoService,
    protected importacaoModeloService: ImportacaoModeloService
  ) {
    super();
  }

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


  ngOnInit(){
    this.idTenant = this.autenticacaoService.usuario().permissaoAtual.idTenant;
    this.inicialize();
  }

  limpeFiltro(): void {
    this.formFiltro.reset();
    this.filtreResetePagina();
  }

  filtreResetePagina() {
    this.filtreItens(false, true);
  }

  situacoesSearchFn(term: string, item: any): any {
    return item.name.toLowerCase().indexOf(term.toLowerCase()) > -1;
  }
  importar(){
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  private construaFormFiltro() {
    this.formFiltro = this.fb.group({
      dataRecebimento: [null],
      dataEntrega: [null],
      numerosPedidos: [[]],
      empresa: [null],
      dataColetaImportacao: [null],
      fornecedor: [null],
      situacoes: [null],
      responsavel: [null],
      origemPedido: [null],
      descricaoPedido: [null],
      dataInicio: [null],
      dataFim: [null],
      cnpj: [null],
      dataRemessaInicio: [null],
      dataRemessaFim: [null],
    });

    this.formFiltro.valueChanges.pipe(
      takeUntil(this.unsubscribe))
      .subscribe((valores) => {
        this.filtro = { ...this.filtro, ...valores };

        let filtroInformado = false;

        for (const property of Object.keys(valores)) {
          if (valores[property] !== null && valores[property] !== '') {
            filtroInformado = true;
            break;
          }
        }

        this.filtroInformado = filtroInformado;
      });
  }


  exportar(relatorio: boolean): void {

    const valideFiltro = this.valideFiltroRelatorio(relatorio);

    if(valideFiltro){
        this.pedidoTrackService
        .exporte(this.funcionalidade, this.filtro)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.arquivoService.createDownloadElement(
              response,
              `Relatório FUP ${(new Date(now()).toLocaleString())}.xlsx`,
            );

            this.emitirToastrDeSucesso();
          },
        (error) => {
          this.errorService.treatError(error);
        }
      )
    }
  }

  baixeModelo(): void {
    this.importacaoModeloService
      .baixarModeloAtivoPorTipo(ImportType['Track'])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => { },
        (error) => {
          this.errorService.treatError(error);
        }
    )
  }


  valideFiltroRelatorio(relatorio: boolean){
    const dataInicio = this.filtro.dataInicio ? new Date(this.filtro.dataInicio) : null;
    const dataFim = this.filtro.dataFim ? new Date(this.filtro.dataFim) : null;

    if(!dataInicio || !dataFim){
        this.toastr.warning('Informe a data inicio e data fim do relatório!')
        return false;
    }

    if(dataInicio > dataFim){
        this.toastr.warning('Data fim não pode ser menor que data inicio!')
        return false;
    }

    if(relatorio == false ){

        const dataMilisegundos = Math.abs(dataInicio.getTime() - dataFim.getTime());
        const dataDias = Math.ceil(dataMilisegundos / (1000 * 60 * 60 * 24));

        if(dataDias > 30 ){
          this.toastr.warning('Periodo não pode ultrapassar 30 dias')
          return false;
        }
      }

    return true;
  }

  selecione(paradasManutencao: PedidoTrackDto[]): void {
    if (paradasManutencao && paradasManutencao instanceof Array && paradasManutencao.length)
      this.pedidosTrackSelecionados = paradasManutencao;

    this.permiteAvancarStatus = paradasManutencao && paradasManutencao.length > 1 ? true : false;
    this.permiteReenviarNotificacao = paradasManutencao && paradasManutencao.length >= 1 ? true : false;
    this.permiteEditar = paradasManutencao.length == 1;
  }

  pagine(paginacao: TablePagination): void {
    this.configuracaoDaTable.page = this.filtro.pagina = paginacao.page;
    this.configuracaoDaTable.pageSize = this.filtro.itensPorPagina = paginacao.pageSize;

    this.filtreItens(false);
  }

  upload() {
    document.getElementById('inputFile').getElementsByTagName('input').item(0).click();
  }

  selecionarArquivo(arquivo: Array<Arquivo>) {
    this.importacaoService.importar(
      {
        arquivo: arquivo[0],
        idTenant: this.idTenant,
        tipoImportacao: this.tipoOperacao.obtenhaTipoImportacao(),
      }
    ).subscribe(
      () => {
        this.toastr.warning(this.translationLibrary.translations.ALERTS.PROCESSANDO_CARGA);
      },
      (error: any) => {
        this.errorService.treatError(error);
        this.filtreItens(false, true);
      },
    );
  }

  filtreItens(emitirToastrDeSucesso: boolean, resetarPagina: boolean = false): void {
    if(this.valideCampos()){

        this.blockUI.start(this.translationLibrary.translations.LOADING);

        if (resetarPagina) {
          this.filtro.pagina = 1;
        }

        this.pedidoTrackService
        .filtreOperacoes(this.funcionalidade, this.filtro)
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (paginacaoPesquisaConfigurada: PaginacaoPesquisaConfiguradaDto<any>) => {
            // Limpando o item selecionado.
            this.selecione([]);

            this.paginacaoPesquisaConfigurada = paginacaoPesquisaConfigurada;
            this.configureGrid();

            if (emitirToastrDeSucesso) {
              this.emitirToastrDeSucesso();
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

  private valideCampos(){

    if((this.filtro.dataRemessaFim == null && this.filtro.dataRemessaInicio != null)
      || (this.filtro.dataRemessaInicio == null && this.filtro.dataRemessaFim != null)){
      this.toastr.warning("Informe Data Remessa Inicio e Data Remessa Fim.")

      return false;
    }

    return true;
  }

  avanceCampos(){
    const modalRef = this.modalService.open(ManterFupCamposComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.paradaManutencaoSelecionados = this.pedidosTrackSelecionados;
    modalRef.componentInstance.idTenant = this.idTenant;
    modalRef.result.then(result => {
      if (result) {
        this.filtreResetePagina();
      }
    });
  }

  editeItem() {
    const modalRef = this.modalService.open(ManterFupComponent, { centered: true, size: 'lg' });

    modalRef.componentInstance.id = this.pedidosTrackSelecionados[0].id;
    modalRef.result.then(result => {
      if (result) {
        this.filtreResetePagina();
      }
    });
  }

  reenvieNotificacao() {
    const modalRef = this.modalService.open(ConfirmacaoComponent, { centered: true });

    modalRef.componentInstance.confirmacao = 'Deseja reenviar notificação do(s) item(ns) selecionado(s) ao(s) fornecedor(es)';
    modalRef.componentInstance.confirmarLabel = 'Sim';
    modalRef.componentInstance.cancelarLabel = 'Fechar';

    modalRef.result.then(result => {
      if (result) {
        this.pedidoTrackService
        .reenvieNotificacao(this.pedidosTrackSelecionados.map(x => x.id))
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(
          (response) => {
            this.emitirToastrDeSucesso();
          },
          (error) => {
            this.errorService.treatError(error);
          }
        );
      }
    });
  }

  private inicialize(): void {
    this.populeSituacoes();
    this.construaFerramentas();
    this.obtenhaColunasDisponiveis();
    this.construaFormFiltro();
    this.filtreItensNaInicializacao();
  }

  private configureGrid(): void {
    this.configuracaoDaTable = {
      page: this.filtro.pagina,
      pageSize: this.filtro.itensPorPagina,
      totalPages: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.numeroPaginas : 0,
      totalItems: this.paginacaoPesquisaConfigurada ? this.paginacaoPesquisaConfigurada.total : 0,
      selectionMode: SelectionModeEnum.Multiple,
      style: TableStyleEnum.Striped
    } as TableConfig<PedidoTrackDto>;
  }

  private filtreItensNaInicializacao(): void {
    this.blockUI.start(this.translationLibrary.translations.LOADING);

    this.pedidoTrackService.obtenhaFiltroSalvo(this.idTenant, this.funcionalidade).pipe(
      takeUntil(this.unsubscribe))
      .subscribe(
        (filtroSalvo: FiltroBase) => {
          this.filtro = { ...filtroSalvo, pagina: 1, itensPorPagina: 5, idTenant: this.idTenant, tipoOperacao: this.tipoOperacao };
          this.formFiltro.patchValue(this.filtro);
          this.filtreItens(false);
        },
        (error: any) => {
          this.errorService.treatError(error);
          this.blockUI.stop();
        });
  }

  private obtenhaColunasDisponiveis(): void {
    this.pedidoTrackService
      .obtenhaColunasDisponiveis(this.funcionalidade)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (colunasDisponiveis: Array<ConfiguracaoColunaDto>) => this.colunasDisponiveis = colunasDisponiveis,
        (error) => this.errorService.treatError(error));
  }

  private emitirToastrDeSucesso(): void {
    this.toastr.success(this.translationLibrary.translations.ALERTS.SUCCESS);
  }

  private populeSituacoes(): void {
    let situacoes = new EnumToArrayPipe().transform(SituacaoPedidoTrack) as Array<any>;
    this.opcoesOrigem = new EnumToArrayPipe().transform(OrigemPedidoTrack) as Array<any>;

    if (situacoes) {
      this.opcoesSituacao = situacoes.sort((a, b) => {
        if (a.name < b.name) { return -1; }
        if (a.name > b.name) { return 1; }
        return 0;
      });
    }
  }

  private navegarparaHistoricoImportacao() {
    this.router.navigate(['historico-importacao'], { relativeTo: this.route });
  }

  private navegarparaHistoricoEmails() {
    this.router.navigate(['historico-email'], { relativeTo: this.route });
  }

  private construaFerramentas(): void {
    const botoes : Ferramenta[] = [
      {
        tooltip: 'Histórico',
        acao: () => { this.navegarparaHistoricoImportacao() },
        icone: 'fa-file-upload',
        classe: 'btn-outline-success',
        label: '',
      },
      {
        tooltip: 'Emails',
        acao: () => { this.navegarparaHistoricoEmails() },
        icone: 'fa-envelope',
        classe: 'btn-outline-success',
        label: 'Emails',
      },
      {
        tooltip: 'Importar',
        acao: () => { this.importar() },
        icone: 'fa-upload',
        classe: 'btn-outline-success',
        label: 'Importar',
      },
      {
        tooltip: 'Relatório',
        acao: () => { this.exportar(true) },
        icone: 'fa-download',
        classe: 'btn-outline-success',
        label: 'Relatório',
      },
      {
        tooltip: 'Baixar Modelo',
        acao: () => { this.baixeModelo() },
        icone: 'fa-download',
        classe: 'btn-outline-success',
        label: 'Baixar Modelo',
      }
    ]

    this.ferramentas.push(...botoes);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
