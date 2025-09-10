import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'input-number-min-value',
  templateUrl: './input-number-min-value.component.html',
  styleUrls: ['./input-number-min-value.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputNumberMinValueComponent),
      multi: true
    }
  ]
})
export class InputNumberMinValueComponent implements OnInit, ControlValueAccessor {
  @Input() min = 1;
  @Input() max = 999999;
  @Input() allowDecimal = false;
  @Input() disabled = false;
  @Input() invalid = false;
  @Input() text_align = 'center';
  @Output() change = new EventEmitter();

  value: any = '';
  maskDecimal = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  maskPositiveInteger = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor() {}

  ngOnInit() {
    if (!this.value) {
      this.value = this.min;
    }
  }

  writeValue(value: any): void {
    this.value = value || this.min;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  add() {
    if (!this.disabled && this.valueAsNumber() < this.max) {
      this.value = this.valueAsNumber() + 1;
      this.emitChange();
    }
  }

  sub() {
    if (!this.disabled && this.valueAsNumber() > this.min) {
      this.value = this.valueAsNumber() - 1;
      this.emitChange();
    }
  }

  blur() {
    this.onTouched();
    this.validateValue();
    this.emitChange();
  }

  private validateValue() {
    const numValue = this.valueAsNumber();
    if (numValue < this.min) {
      this.value = this.min;
    } else if (numValue > this.max) {
      this.value = this.max;
    }
  }

  private emitChange() {
    this.onChange(this.valueAsNumber());
    this.change.emit(this.valueAsNumber());
  }

  valueAsNumber(): number {
    return parseFloat(this.value) || this.min;
  }
}