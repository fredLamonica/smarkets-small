import { Component, Input, OnInit } from '@angular/core';
import { Indicador } from '@shared/models';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'sdk-chart-area',
  templateUrl: './sdk-chart-area.component.html',
  styleUrls: ['./sdk-chart-area.component.scss']
})
export class SdkChartAreaComponent implements OnInit {
  @Input('indicador') indicador: Indicador;
  @Input('colors') colors: string[];
  @Input() fill: boolean;
  @Input() lineTension: number = 0.3;
  @Input() displayDatalabels: boolean = true;
  @Input() height: string = '300px';
  @Input() beginAtZero: boolean = true;

  constructor() {}

  ngOnInit() {
    this.construirGraficoLine();
  }

  public construirGraficoLine() {
    this.labels = this.indicador.label.map(label => {
      return label;
    });
    this.data = this.indicador.dataSets.map(dataset => {
      return dataset.data;
    });

    if (this.colors) {
      this.cores = [{ backgroundColor: this.colors }];
    }

    this.preencherData();
  }

  public areaChartOptions: ChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    legend: {
      position: 'bottom',
      labels: {
        boxWidth: 12
      }
    },
    plugins: {
      datalabels: {
        color: '#6E6E72',
        align: function (context) {
          let value = context.dataset.data[context.dataIndex];
          let last = context.dataset.data[context.dataset.data.length - 1];
          return value === last ? 'left' : 'top';
        },
        anchor: 'start',
        offset: 4,
        formatter: (value, ctx) => {
          return value;
        },
        font: {
          size: 12,
          weight: 'bold'
        }
      }
    },
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: this.beginAtZero
          }
        }
      ]
    }
  };

  // color: '#FFCE56',
  public preencherData() {
    this.datasets = [
      {
        borderColor: this.colors,
        fill: this.fill,
        lineTension: this.lineTension,
        datalabels: {
          display: this.displayDatalabels
        }
      }
    ];
  }

  public datasets: Array<any>;

  public labels: Label[];
  public data: Array<any>;
  public type: ChartType = 'line';
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
