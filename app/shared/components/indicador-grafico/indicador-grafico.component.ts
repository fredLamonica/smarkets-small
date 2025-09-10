import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Indicador } from '@shared/models';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'indicador-grafico',
  templateUrl: './indicador-grafico.component.html',
  styleUrls: ['./indicador-grafico.component.scss']
})
export class IndicadorGraficoComponent implements OnInit {
  @Input('titulo') titulo: string;
  @Input('sub-titulo') subTitulo: string;
  @Input('indicador') indicador: Indicador;
  @Input('tipo') tipo: 'pie' | 'bar';
  @Input('permitir-download') permitirDownload: boolean = false;
  @Output('download') downloadEmitter = new EventEmitter();

  constructor() {}

  ngOnInit() {
    if (this.tipo == 'pie') this.construirGraficoPie();
  }

  public construirGraficoPie() {
    this.labels = this.indicador.label.map(label => {
      return label;
    });
    this.data = this.indicador.dataSets.map(dataset => {
      return dataset.data;
    });
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12
      }
    },
    plugins: {
      datalabels: {
        color: '#FFFFFF',
        align: function (context) {
          var chart = context.chart;
          var area = chart.chartArea;
          var meta = chart.getDatasetMeta(context.datasetIndex);

          // WARNING: meta.data._model is PRIVATE and thus can
          // change without notice, breaking code relying on it!
          var model = meta.data[context.dataIndex]._model;
          var bottom = Math.min(model.base, area.bottom);
          var height = bottom - model.y;
          return height < 25 ? 'end' : 'start';
        },
        anchor: 'end',
        offset: 4,
        formatter: (value, ctx) => {
          return value;
        },
        font: {
          size: 14
        }
      }
    }
  };

  public labels: Label[];
  public data: Array<any>;
  public type: ChartType = 'pie';
  public legenda = true;
  public cores = [
    {
      backgroundColor: [
        '#1D4EA2',
        '#4293DE',
        '#404285',
        '#787AB9',
        '#2382AF',
        '#54854F',
        '#01B38F',
        '#5A58A4'
      ]
    }
  ];

  public pieChartPlugins = [pluginDataLabels];

  public download() {
    this.downloadEmitter.emit();
  }
}
