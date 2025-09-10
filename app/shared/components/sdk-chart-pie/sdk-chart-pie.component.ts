import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Indicador } from '@shared/models';
import { Chart, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'sdk-chart-pie',
  templateUrl: './sdk-chart-pie.component.html',
  styleUrls: ['./sdk-chart-pie.component.scss']
})
export class SdkChartPieComponent implements OnInit {
  @Input('indicador') indicador: Indicador;
  @Input('colors') colors: string[];
  @Output() event = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.construirGraficoPie();
  }

  public construirGraficoPie() {
    this.labels = this.indicador.label.map(label => {
      return label;
    });
    this.data = this.indicador.dataSets.map(dataset => {
      return dataset.data;
    });
    if (this.colors) {
      this.cores = [{ backgroundColor: this.colors }];
    }
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12
      }
    },
    tooltips: {
      mode: 'label',
      callbacks: {
        label: function (tooltipItem, data) {
          var indice = tooltipItem.index;
          return data.labels[indice] + ': ' + data.datasets[0].data[indice] + '';
        }
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
    },
    onClick: (evt, item: any) => {
      if (item[0]) {
        let index = item[0]._index;
        const label = this.labels[index];
        this.event.emit(label);
      }
    }
  };

  public labels: Label[];
  public data: Array<any>;
  public type: ChartType = 'pie';
  public legenda = false;
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
}
