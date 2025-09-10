import { Component, OnInit, forwardRef, Input, Injectable, OnChanges, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'

// #region Internacionalizacao
const I18N_VALUES = {
  'pt-br': {
    weekdaysShortName: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    monthsFullName: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    monthsShortName: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  }
};

// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
@Injectable()
export class I18n {
  language = 'pt-br';
}

// Define custom service providing the months and weekdays translations
@Injectable()
export class CustomDatepickerI18n extends NgbDatepickerI18n {

  constructor(private _i18n: I18n) {
    super();
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdaysShortName[weekday - 1];
  }

  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].monthsShortName[month - 1];
  }

  getMonthFullName(month: number): string {
    return I18N_VALUES[this._i18n.language].monthsFullName[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}
// #endregion

@Component({
  selector: 'input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  providers: [
    I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n },
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputDateComponent), multi: true }
  ],
})
export class InputDateComponent implements OnInit, ControlValueAccessor, OnChanges {

  private dateMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]; 
  private datetimeMask = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, ':', /\d/, /\d/]; 
  public mask: (string | RegExp)[];

  public dateRegex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/);
  public datetimeRegex = new RegExp(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}( )([0-1][0-9]|(2)[0-4])(:)([0-5]\d)$/);
  public regex: RegExp;

  public datePlaceholder = "dd/mm/aaaa";
  public datetimePlaceholder = "dd/mm/aaaa hh:mm";
  public placeholder: string;

  public autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');

  @Input() type: "date" | "datetime" = "date";

  @Input('min') min: string = '1900-01-01'; 
  public minDate: NgbDateStruct;
  @Input('max') max: string;
  public maxDate: NgbDateStruct;

  public maskedDate: any;
  public datePick: NgbDateStruct;

  @Input() disabled: boolean = false;

  private _value: string;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    if(value) {
      if(this.type == "datetime") {
        this.propagateChange(this.formatDatetime(value));
      } else {
        this.propagateChange(this.formatDate(value));
      }
    } else {
      this.propagateChange(value);
    }    
  }

  public formatDate(value: string) {
    let date = value.split('/');
    return `${date[2]}-${date[1]}-${date[0]}`;
  }

  public formatDatetime(value: string) {
    let date = value.split('/');
    let time = date[2].split(' ');
    return `${date[2]}-${date[1]}-${date[0]}T${time[1]}`;
  }

  ngOnInit() {
    this.prepare();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes) {
      this.prepare();
    }
  }
  
  constructor() { }
  
  // #region Preparation Methods
  private prepare() {
    this.setMin();
    this.setMax();
    this.setMask();
    this.setRegex();
    this.setAutoCorrectedDatePipe();
    this.setPlaceholder();
  }

  private setMin() {
    if(this.min) {
      let minDate = this.min.split('-');
      this.minDate = { year: +minDate[0], month: +minDate[1], day: +minDate[2] };
    }  else {
      this.minDate = null;
    }
  }

  private setMax() {
    if(this.max) {
      let maxDate = this.max.split('-');
      this.maxDate = { year: +maxDate[0], month: +maxDate[1], day: +maxDate[2] };
    }   else {
      this.maxDate = null;
    }
  }

  private setMask() {
    if(this.type == 'datetime') 
      this.mask = this.datetimeMask;
    else
      this.mask = this.dateMask;
  }

  private setRegex() {
    if(this.type == 'datetime') 
      this.regex = this.datetimeRegex;
    else
      this.regex = this.dateRegex;
  }

  private setAutoCorrectedDatePipe() {
    if(this.type == 'datetime') 
      this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy');
    else
      this.autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd/mm/yyyy HH:MM');
  }

  private setPlaceholder() {
    if(this.type == 'datetime') 
      this.placeholder = this.datetimePlaceholder;
    else
      this.placeholder = this.datePlaceholder;
  }
  // #endregion

  public changeDateInput(event) {
    if(event && this.regex.test(event)) {
      this.value = event;
    } else {
      this.value = null;
    }

    this._value = event;
  }

  public changeDatePicker(event) {
    if(event) {
      this.value = moment(`${event.month}-${event.day}-${event.year}`, "MM-DD-YYYY").format("DD/MM/YYYY");
    }
  }

  // #region Accessors Methods
  writeValue(obj: any): void {
    if(obj) {
      if(this.type == "datetime") {
        this._value = moment(obj).format("DD/MM/YYYY HH:mm");
      } else {
        this._value = moment(obj).format("DD/MM/YYYY");
      }
    }
  }

  propagateChange = (_: any) => { };
  
  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  // #endregion

}
