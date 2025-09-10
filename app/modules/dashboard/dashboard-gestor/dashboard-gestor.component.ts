import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Classificacao,
  Indicador,
  MatrizResponsabilidade,
  PessoaJuridica,
  UnidadeMedidaTempo
} from '@shared/models';
import { ConfiguracaoDash } from '@shared/models/enums/configuracao-dash';
import {
  ArquivoService,
  AutenticacaoService,
  MatrizResponsabilidadeService,
  PessoaJuridicaService,
  SlaService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ToastrService } from 'ngx-toastr';
import { CategoriaProduto } from './../../../shared/models/categoria-produto';
import { BackLogDto } from './../../../shared/models/dto/back-log-dto';
import { IndicadoresAging } from './../../../shared/models/indicador/indicadores-aging';
import { IndicadoresPedido } from './../../../shared/models/indicador/indicadores-pedido';
import { IndicadoresRequisicao } from './../../../shared/models/indicador/indicadores-requisicao';
import { Dashboard } from './../dashboard';

import { FormBuilder, FormGroup } from '@angular/forms';
import { DashboardFiltro } from '@shared/models/fltros/dash-board-filtro';
import * as moment from 'moment';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { IndicadorService } from '../../../shared/providers/indicador.service';

@Component({
  selector: 'dashboard-gestor',
  templateUrl: './dashboard-gestor.component.html',
  styleUrls: ['./dashboard-gestor.component.scss']
})
export class DashboardGestorComponent implements OnInit, OnDestroy, Dashboard {
  @BlockUI() blockUI: NgBlockUI;

  public hasIntegracao: boolean;
  public configuracaoDash = ConfiguracaoDash;

  public indicadoresNumericos: Array<Indicador>;
  public indicadorRequisicoesSemResponsavelPorCategoria: Indicador;
  public pendenciasMatrizResponsabilidade: Array<MatrizResponsabilidade>;

  public UnidadeMedidaTempo = UnidadeMedidaTempo;

  // Dash Integração
  public formFiltro: FormGroup;
  private filtro: DashboardFiltro;

  public filiais: Array<PessoaJuridica>;
  public filiais$: Observable<Array<PessoaJuridica>>;
  public filiaisLoading: boolean;

  public slas: Array<Classificacao>;
  public slas$: Observable<Array<Classificacao>>;
  public slasLoading: boolean;

  public indicadoresRequisicao: IndicadoresRequisicao;
  public indicadoresRequisicaoLoading = true;

  public indicadoresPedido: IndicadoresPedido;
  public indicadoresPedidoLoading = true;

  public indicadoresAging: IndicadoresAging;
  public indicadoresAgingLoading = true;

  public backLogLoading: boolean = true;
  public backLogs: Array<BackLogDto>;
  // END Dash Integração

  private subscriptions: Subscription[] = [];

  constructor(
    private translationLibrary: TranslationLibraryService,
    private indicadorService: IndicadorService,
    private matrizResponsabilidadeService: MatrizResponsabilidadeService,
    private toastr: ToastrService,
    private arquivoService: ArquivoService,
    private fb: FormBuilder,
    private pessoaJuridicaService: PessoaJuridicaService,
    private authService: AutenticacaoService,
    public slaService: SlaService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngOnInit() {
    this.chooseDash();
  }

  private exibirDashIntegracao() {
    this.construirFormularioFiltro();
    this.subListas();
    this.filtrar();
  }

  private chooseDash() {
    let configuracaoDash = this.authService.usuario().permissaoAtual.pessoaJuridica
      .configuracaoDash;

    switch (configuracaoDash) {
      case this.configuracaoDash.Integracao:
        this.hasIntegracao = true;
        this.exibirDashIntegracao();
        break;
      case this.configuracaoDash.Padrao:
        this.hasIntegracao = false;
        this.construirDashboard();
        break;
      default:
        break;
    }
  }

  private subListas() {
    this.subSLas();
    this.subFiliais();
  }

  private subSLas() {
    this.slasLoading = true;
    this.slas$ = this.slaService.listarClassificacoes().pipe(
      catchError(() => of([])),
      tap(slas => {
        this.slas = slas;
        this.slasLoading = false;
      }),
      shareReplay()
    );
  }

  private async indicadores(filtro: DashboardFiltro = null) {
    await this.requisicoes(filtro);
    await this.pedidos(filtro);
    await this.aging(filtro);
    await this.backLog(filtro);
  }

  public async requisicoes(filtro: DashboardFiltro) {
    this.subscriptions.push(
      this.indicadorService.indicadoresRequisicao(filtro).subscribe(
        response => {
          if (response) {
            this.indicadoresRequisicao = response;
            this.indicadoresRequisicaoLoading = false;
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  public async pedidos(filtro: DashboardFiltro) {
    this.subscriptions.push(
      this.indicadorService.indicadoresPedido(filtro).subscribe(
        response => {
          if (response) {
            this.indicadoresPedido = response;
            this.indicadoresPedidoLoading = false;
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  public async aging(filtro: DashboardFiltro) {
    this.subscriptions.push(
      this.indicadorService.indicadoresAging(filtro).subscribe(
        response => {
          if (response) {
            this.indicadoresAging = response;
            this.indicadoresAgingLoading = false;
          }
        },
        error => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  public async backLog(filtro: DashboardFiltro) {
    this.subscriptions.push(
      this.indicadorService.backLog(filtro).subscribe(
        response => {
          if (response) {
            this.backLogs = response;
          } else {
          }
          this.backLogLoading = false;
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  private subFiliais() {
    this.filiaisLoading = true;
    this.filiais$ = this.pessoaJuridicaService.ObterFiliais().pipe(
      catchError(() => of([])),
      tap(filiais => {
        this.filiais = filiais;
        this.filiaisLoading = false;
      }),
      shareReplay()
    );
  }

  private construirFormularioFiltro() {
    this.formFiltro = this.fb.group({
      idSolicitacaoDocumentoFornecedor: [null],
      idTenant: [null],
      idDocumentoFornecedor: [null],
      categoriaProduto: [new Array<CategoriaProduto>()],
      codigoFilialEmpresa: [new Array<PessoaJuridica>()],
      dataInicio: [moment().startOf('month').format('YYYY-MM-DD')],
      dataFim: [moment().format('YYYY-MM-DD')],
      sla: [new Array<Classificacao>()]
    });
  }

  public construirDashboard() {
    this.resetIndicadores();
    this.obterPendenciasMatrizResponsabilidade();
    this.obterIndicadoresNumericos();
  }

  private resetIndicadores() {
    this.indicadorRequisicoesSemResponsavelPorCategoria = null;
    this.indicadoresNumericos = null;
    this.pendenciasMatrizResponsabilidade = null;
    this.indicadoresRequisicaoLoading = true;
    this.indicadoresAgingLoading = true;
    this.backLogLoading = true;

    this.indicadoresPedidoLoading = true;
    this.backLogs = null;
  }

  public obterIndicadoresNumericos() {
    this.subscriptions.push(
      this.indicadorService.obter().subscribe(
        response => {
          this.tratarIndicadores(response);
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  private tratarIndicadores(indicadores: Array<Indicador>) {
    if (indicadores) {
      this.indicadorRequisicoesSemResponsavelPorCategoria = indicadores.pop();
      this.indicadoresNumericos = indicadores;
    } else {
      this.indicadorRequisicoesSemResponsavelPorCategoria = new Indicador();
      this.indicadoresNumericos = new Array<Indicador>();
    }
  }

  private obterPendenciasMatrizResponsabilidade() {
    this.subscriptions.push(
      this.matrizResponsabilidadeService.obterPendencias().subscribe(
        response => {
          if (response) this.tratarPendeciasMatrizResponsabilidade(response);
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  private tratarPendeciasMatrizResponsabilidade(matriz: Array<MatrizResponsabilidade>) {
    if (matriz) this.pendenciasMatrizResponsabilidade = matriz;
    else this.pendenciasMatrizResponsabilidade = new Array<MatrizResponsabilidade>();
  }

  public downloadRequisicoesSemResponsavel() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.subscriptions.push(
      this.indicadorService.downloadRequisicoesSemResponsavel().subscribe(
        response => {
          this.arquivoService.createDownloadElement(
            response,
            `Requisições sem responsável - ${moment().format('YYYY_MM_DD-HH_mm')}.csv`
          );
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  public downloadMatrizPendente() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.subscriptions.push(
      this.indicadorService.downloadMatrizPendencias().subscribe(
        response => {
          this.arquivoService.createDownloadElement(
            response,
            `Categorias pendentes na matriz de responsabilidade - ${moment().format(
              'YYYY_MM_DD-HH_mm'
            )}.csv`
          );
          this.blockUI.stop();
        },
        () => {
          this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
          this.blockUI.stop();
        }
      )
    );
  }

  public filtrar() {
    let form = this.formFiltro.value;
    this.filtro = new DashboardFiltro(
      form.codigoFilialEmpresa,
      form.sla,
      form.dataInicio,
      form.dataFim
    );

    if (this.filtroValido(this.filtro)) {
      this.resetIndicadores();

      this.indicadores(this.filtro);
    }
  }

  private filtroValido(filtro: DashboardFiltro): boolean {
    var data_inicio = new Date(filtro.dataInicio);
    var data_fim = new Date(filtro.dataFim);

    if (filtro.dataInicio || filtro.dataFim) {
      if (filtro.dataInicio == null || filtro.dataInicio.toString() == '') {
        this.toastr.warning('Data Inicio do filtro não pode ser vazia');
        return false;
      }
      if (filtro.dataFim == null || filtro.dataFim.toString() == '') {
        this.toastr.warning('Data Fim do filtro não pode ser vazia');
        return false;
      }
      if (data_inicio > data_fim) {
        this.toastr.warning('Data Fim do filtro não pode ser maior que Data Inicio');
        return false;
      }
    }

    return true;
  }
}
