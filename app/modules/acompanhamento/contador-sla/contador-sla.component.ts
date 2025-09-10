import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Moeda, SituacaoSolicitacaoItemCompra, UnidadeMedidaTempo } from '@shared/models';
import * as moment from 'moment';
import * as business from 'moment-business';

@Component({
  selector: 'contador-sla',
  templateUrl: './contador-sla.component.html',
  styleUrls: ['./contador-sla.component.scss']
})
export class ContadorSlaComponent implements OnInit {
  @Input('tempoSla') tempoSla: number = 0;
  @Input('unidadeMedidaTempoSla') unidadeMedidaTempoSla: UnidadeMedidaTempo = 0;
  @Input('ultimoRegistroInicioSla') ultimoRegistroInicioSla: Date;
  @Input('tempoDecorrido') tempoDecorrido: number = 0;
  public slaStart: string;
  public slaEvent: string;
  public SituacaoSolicitacaoItemCompra = SituacaoSolicitacaoItemCompra;
  public Moeda = Moeda;

  public eventTimeInput: string;
  public startTimeInput: string;
  public ignoreWeekends: boolean = true;
  public allowActions: boolean = true;
  public paused: boolean = false;
  @Output('pause') pauseEmitter = new EventEmitter();
  @Output('start') startEmitter = new EventEmitter();

  public eventTime: number;
  public startTime: number;

  public diffTime: number;
  public duration: any;
  public interval = 1000;

  constructor() {}

  ngOnInit() {
    this.iniciarCronometro();

    this.eventTime = moment(this.slaEvent).unix();
    this.startTime = moment(this.slaStart).unix();

    this.diffTime = this.eventTime - this.startTime;
    this.duration = moment.duration(this.diffTime * 1000, 'milliseconds');

    setInterval(() => {
      if (!this.paused && this.isWeekday())
        this.duration = moment.duration(this.duration.subtract(this.interval), 'milliseconds');
    }, this.interval);
  }

  public pauseStart() {
    this.paused = !this.paused;
    if (this.paused) this.pauseEmitter.emit();
    else this.startEmitter.emit();
  }

  public isWeekday(): boolean {
    return business.isWeekDay(moment());
  }

  public isAfterEvent(): boolean {
    if (this.duration) return this.duration.asMilliseconds() < 0;
    else return false;
  }

  public iniciarCronometro() {
    //Preparar dados cronometro
    let slaMs = moment
      .duration(
        this.tempoSla,
        this.unidadeMedidaTempoSla == UnidadeMedidaTempo.Dia ? 'days' : 'hours'
      )
      .asMilliseconds();

    let now = moment();

    if (business.isWeekendDay(now)) {
      if (now.isoWeekday() == 6) now = now.subtract(0, 'day');
      else now = now.subtract(1, 'day');

      now.set('hours', 0);
      now.set('minutes', 0);
      now.set('seconds', 0);
    }

    this.slaStart = now.format();

    //Calculo para obter tempo restante:
    // now + (tempoSla'ms - (duracao'ms + (now - ultimoRegistroInicioSla)'ms)

    let weekendDays = business.weekendDays(moment(this.ultimoRegistroInicioSla), now);

    let tempoDecorridoMs =
      this.tempoDecorrido +
      (now.diff(moment(this.ultimoRegistroInicioSla), 'milliseconds') -
        moment.duration(weekendDays, 'days').asMilliseconds());
    let tempoToSlaMs = slaMs - tempoDecorridoMs;

    this.slaEvent = now.add(tempoToSlaMs, 'milliseconds').format();
  }
}
