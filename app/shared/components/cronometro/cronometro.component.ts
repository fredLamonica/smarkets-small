import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import * as business from 'moment-business';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.scss'],
})
export class CronometroComponent implements OnInit {

  // tslint:disable-next-line: no-input-rename
  @Input('event-time') eventTimeInput: string;
  // tslint:disable-next-line: no-input-rename
  @Input('start-time') startTimeInput: string;
  // tslint:disable-next-line: no-input-rename
  @Input('ignore-weekends') ignoreWeekends: boolean = true;
  // tslint:disable-next-line: no-input-rename
  @Input('allow-actions') allowActions: boolean = true;
  // tslint:disable-next-line: no-input-rename
  @Input('paused') paused: boolean = false;
  // tslint:disable-next-line: no-input-rename
  @Input('inline-mode') inlineMode: boolean = false;

  // tslint:disable-next-line: no-output-rename
  @Output('pause') pauseEmitter = new EventEmitter();
  // tslint:disable-next-line: no-output-rename
  @Output('start') startEmitter = new EventEmitter();

  readonly weekendDayMessage = 'SLA não é contabilizada aos finais de semana';

  eventTime: number;
  startTime: number;
  diffTime: number;
  duration: any;
  interval = 1000;

  constructor() { }

  ngOnInit() {
    this.eventTime = moment(this.eventTimeInput).unix();
    this.startTime = moment(this.startTimeInput).unix();

    this.diffTime = this.eventTime - this.startTime;
    this.duration = moment.duration(this.diffTime * 1000, 'milliseconds');

    setInterval(() => {
      if (!this.paused && this.isWeekday()) {
        this.duration = moment.duration(this.duration.subtract(this.interval), 'milliseconds');
      }
    }, this.interval);
  }

  pauseStart() {
    this.paused = !this.paused;

    if (this.paused) {
      this.pauseEmitter.emit();
    } else {
      this.startEmitter.emit();
    }
  }

  isWeekday(): boolean {
    return business.isWeekDay(moment());
  }

  isAfterEvent(): boolean {
    return this.duration.asMilliseconds() < 0;
  }
}
