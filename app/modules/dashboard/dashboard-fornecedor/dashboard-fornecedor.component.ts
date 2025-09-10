import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TagFiltered, TagFilteredValue } from '@shared/models/fltros/tag-filtered';
import { IndicadoresFornecedorDto } from '@shared/models/indicador/indicadores-fornecedor';
import { IndicadoresFornecedorDocumentosDto } from '@shared/models/indicador/indicadores-fornecedor-documento';
import { IndicadoresPendenciaDto } from '@shared/models/indicador/indicadores-fornecedor-pendencia';
import { IndicadorFornecedorPlanoAcao } from '@shared/models/indicador/indicadores-fornecedor-plano-acao';
import { IndicadoresFornecedorQuestionariosPorStatusDto } from '@shared/models/indicador/indicadores-fornecedor-questionarios-status';
import {
  AutenticacaoService,
  TranslationLibraryService
} from '@shared/providers';
import { BlockUI } from 'ng-block-ui';
import { NgBlockUI } from 'ng-block-ui/lib/models/block-ui.model';
import { ToastrService } from 'ngx-toastr';
import { IndicadorService } from '../../../shared/providers/indicador.service';
import { Indicador, IndicadorDataSet } from './../../../shared/models/indicador/indicador';

@Component({
  selector: 'dashboard-fornecedor',
  templateUrl: './dashboard-fornecedor.component.html',
  styleUrls: ['./dashboard-fornecedor.component.scss']
})
export class DashboardFornecedorComponent implements OnInit {
  @BlockUI() blockUI: NgBlockUI;

  indicadoresFornecedorDto: IndicadoresFornecedorDto;

  indicadoresFornecedorDocumentosDto: IndicadoresFornecedorDocumentosDto;
  indicadorArea: Indicador;

  IndicadoresFornecedorQuestionariosPorStatusDto: IndicadoresFornecedorQuestionariosPorStatusDto;
  indicadorPie: Indicador;

  indicadoresPendenciaDto: IndicadoresPendenciaDto;
  indicadorPendenciaPorHora: Indicador;

  indicadoresFornecedorPlanoAcao: IndicadorFornecedorPlanoAcao;
  indicadorFornecedorPlanoAcao: Indicador;

  constructor(
    private authService: AutenticacaoService,
    private translationLibrary: TranslationLibraryService,
    private toastr: ToastrService,
    private indicadorService: IndicadorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.construirDashboard();
  }

  public construirDashboard() {
    this.obterIndicadores();
  }

  private obterIndicadores() {
    this.fornecedores();
    this.fornecedoresdocumentos();
    this.fornecedoresquestionarios();
    this.fornecedorespendencias();
    this.fornecedoresplanoacao();
  }

  private fornecedores() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.fornecedores().subscribe(
      response => {
        this.indicadoresFornecedorDto = response;
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private fornecedoresdocumentos() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.fornecedoresdocumentos().subscribe(
      response => {
        this.indicadoresFornecedorDocumentosDto = response;
        this.construirIndicadorArea();
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private fornecedoresquestionarios() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.fornecedoresquestionarios().subscribe(
      response => {
        this.IndicadoresFornecedorQuestionariosPorStatusDto = response;
        this.construirIndicadorPie();
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private fornecedorespendencias() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.fornecedorespendencias().subscribe(
      response => {
        this.indicadoresPendenciaDto = response;
        this.construirIndicadorPendenciaPorHora();
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private fornecedoresplanoacao() {
    this.blockUI.start(this.translationLibrary.translations.LOADING);
    this.indicadorService.fornecedoresplanoacao().subscribe(
      response => {
        this.indicadoresFornecedorPlanoAcao = response;
        this.construirIndicadorPlanoAcao();
        this.blockUI.stop();
      },
      () => {
        this.toastr.error(this.translationLibrary.translations.ALERTS.INTERNAL_SERVER_ERROR);
        this.blockUI.stop();
      }
    );
  }

  private construirIndicadorPie() {
    this.indicadorPie = this.createIndicator(
      ['Em andamento', 'Pendentes', 'Respondidos'],
      [
        this.IndicadoresFornecedorQuestionariosPorStatusDto.emAndamento,
        this.IndicadoresFornecedorQuestionariosPorStatusDto.pendentes,
        this.IndicadoresFornecedorQuestionariosPorStatusDto.respondido
      ],
      ['#01B0F1', '#E38888', '#B9E08C']
    );
  }

  private createIndicator(labels: string[], datas: number[], colors: string[]) {
    let auxLabels;
    let auxDatas;
    let auxColors;
    let indicator = new Indicador();
    let indicatorDataSet = new IndicadorDataSet();
    datas.forEach((d, index) => {
      if (d == 0) {
        auxLabels = labels.filter((c, i) => i != index);
        auxColors = colors.filter((c, i) => i != index);
      }
    });

    auxDatas = datas.filter(d => d != 0);

    indicator.label = !auxLabels ? labels : auxLabels;
    indicatorDataSet.data = auxDatas;
    indicator.colors = !auxColors ? colors : auxColors;
    indicator.dataSets = [indicatorDataSet];
    return indicator;
  }

  private construirIndicadorArea() {
    this.indicadorArea = new Indicador();
    this.indicadorArea.label = ['Válidos', 'A Vencer', 'Vencidos', 'Recusados', 'Não Enviados'];
    let data = [
      this.indicadoresFornecedorDocumentosDto.totalDocumentosValidos,
      this.indicadoresFornecedorDocumentosDto.totalDocumentosAVencer,
      this.indicadoresFornecedorDocumentosDto.totalDocumentosVencidos,
      this.indicadoresFornecedorDocumentosDto.totalDocumentosInvalidos,
      this.indicadoresFornecedorDocumentosDto.totalDocumentosNaoEnviados
    ];

    this.indicadorArea.dataSets = new Array<IndicadorDataSet>();

    let indicadorDataSet = new IndicadorDataSet();
    indicadorDataSet.data = data;

    this.indicadorArea.dataSets.push(indicadorDataSet);
  }

  private construirIndicadorPendenciaPorHora() {
    this.indicadorPendenciaPorHora = new Indicador();
    this.indicadorPendenciaPorHora.label = this.indicadoresPendenciaDto.pendenciasPorHorasDto.map(
      p => p.horas
    );
    let data = this.indicadoresPendenciaDto.pendenciasPorHorasDto.map(p => p.quantidade);
    this.indicadorPendenciaPorHora.dataSets = new Array<IndicadorDataSet>();
    let indicadorDataSet = new IndicadorDataSet();
    indicadorDataSet.data = data;

    this.indicadorPendenciaPorHora.dataSets.push(indicadorDataSet);
  }

  private construirIndicadorPlanoAcao() {
    this.indicadorFornecedorPlanoAcao = new Indicador();
    this.indicadorFornecedorPlanoAcao.label = [
      'Pendentes',
      'Em Andamento',
      'Atrasados',
      'Finalizados'
    ];
    let data = [
      this.indicadoresFornecedorPlanoAcao.pendentes,
      this.indicadoresFornecedorPlanoAcao.emAndamento,
      this.indicadoresFornecedorPlanoAcao.atrasados,
      this.indicadoresFornecedorPlanoAcao.finalizados
    ];

    this.indicadorFornecedorPlanoAcao.dataSets = new Array<IndicadorDataSet>();
    let indicadorDataSet = new IndicadorDataSet();
    indicadorDataSet.data = data;

    this.indicadorFornecedorPlanoAcao.dataSets.push(indicadorDataSet);
  }

  public redirect(tagFiltered: string, tagFilteredValue: any) {
    switch (tagFiltered) {
      case 'statusDocumento':
        const applyFilterDocuments = this.setFiltersOfDocuments(tagFiltered, tagFilteredValue);
        sessionStorage.setItem('rede-fornecedora-filters', JSON.stringify([applyFilterDocuments]));
        break;
      case 'statusPendencia':
        const applyFilterPendencies = this.setFilterOfPendencies(tagFiltered, tagFilteredValue);
        sessionStorage.setItem('rede-fornecedora-filters', JSON.stringify([applyFilterPendencies]));
        break;
      case 'situacaoQuestionario':
        const applyfilterQuizzes = this.setFilterOfQuizzes(tagFiltered, tagFilteredValue);
        sessionStorage.setItem('rede-fornecedora-filters', JSON.stringify([applyfilterQuizzes]));
        break;
      case 'statusPlanoAcao':
        const applyfilterActionPlans = this.setFilterOfActionPlan(tagFiltered, tagFilteredValue);
        sessionStorage.setItem(
          'rede-fornecedora-filters',
          JSON.stringify([applyfilterActionPlans])
        );
        break;
    }

    this.router.navigate(['/fornecedores/local']);
  }

  private setFiltersOfDocuments(tagFiltered: string, tagFilteredValue: string) {
    const filter = new TagFiltered(tagFiltered);
    switch (tagFilteredValue) {
      case 'Aprovados':
        const aprovados = new TagFilteredValue(tagFilteredValue, 1);
        filter.add([aprovados]);
        return filter;
      case 'Vencidos':
        const vencidos = new TagFilteredValue(tagFilteredValue, 2);
        filter.add([vencidos]);
        return filter;
      case 'Não enviados':
        const naoEnviados = new TagFilteredValue(tagFilteredValue, 3);
        filter.add([naoEnviados]);
        return filter;
      case 'Recusados':
        const recusados = new TagFilteredValue(tagFilteredValue, 4);
        filter.add([recusados]);
        return filter;
      case 'A vencer em 30 dias':
        const avencer = new TagFilteredValue(tagFilteredValue, 5);
        filter.add([avencer]);
        return filter;
    }
  }

  private setFilterOfPendencies(tagFiltered: string, tagFilteredValue: string) {
    const filter = new TagFiltered(tagFiltered);
    switch (tagFilteredValue) {
      case 'Pendentes':
        const pendentes = new TagFilteredValue(tagFilteredValue, 1);
        filter.add([pendentes]);
        return filter;
      case 'Resolvidas':
        const vencidos = new TagFilteredValue(tagFilteredValue, 2);
        filter.add([vencidos]);
        return filter;
    }
  }

  private setFilterOfQuizzes(tagFiltered: string, tagFilteredValue: string) {
    const filter = new TagFiltered(tagFiltered);
    switch (tagFilteredValue) {
      case 'Pendentes':
        const pendentes = new TagFilteredValue(tagFilteredValue, 1);
        filter.add([pendentes]);
        return filter;
      case 'Em andamento':
        const emAndamento = new TagFilteredValue(tagFilteredValue, 2);
        filter.add([emAndamento]);
        return filter;
      case 'Respondidos':
        const respondidos = new TagFilteredValue(tagFilteredValue, 3);
        filter.add([respondidos]);
        return filter;
    }
  }

  private setFilterOfActionPlan(tagFiltered: string, tagFilteredValue: string) {
    const filter = new TagFiltered(tagFiltered);
    switch (tagFilteredValue) {
      case 'Pendentes':
        const pendentes = new TagFilteredValue(tagFilteredValue, 3);
        filter.add([pendentes]);
        return filter;
      case 'Em Andamento':
        const emAndamento = new TagFilteredValue(tagFilteredValue, 1);
        filter.add([emAndamento]);
        return filter;
      case 'Atrasados':
        const atrasados = new TagFilteredValue(tagFilteredValue, 4);
        filter.add([atrasados]);
        return filter;
      case 'Finalizados':
        const respondidos = new TagFilteredValue(tagFilteredValue, 2);
        filter.add([respondidos]);
        return filter;
    }
  }
}
