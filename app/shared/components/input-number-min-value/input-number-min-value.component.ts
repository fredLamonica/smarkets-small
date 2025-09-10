import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MaskService } from '@shared/providers';

@Component({
  selector: 'input-number-min-value',
  templateUrl: './input-number-min-value.component.html',
  styleUrls: ['./input-number-min-value.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputNumberMinValueComponent), multi: true },
  ],
})
export class InputNumberMinValueComponent implements OnInit, ControlValueAccessor {
  @Input('integer-limit') integerLimit: number = 9;
  @Input() max: number;
  @Input() min: number;
  @Input() disabled: boolean = false;
  @Input() invalid: boolean = false;
  @Output('blur') blurEmitter = new EventEmitter();
  @Output('change') changeEmitter = new EventEmitter();

  @Input() allowDecimal = false;

  @Input() text_align: string = 'center';

  maskPositiveInteger = this.maskService.positiveIntegerMask;
  maskDecimal = this.maskService.positiveDecimalMask;

  private _value: string;

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this._value = value;
    if (this.allowDecimal) {
      this.propagateChange(this.maskService.maskedValueToNumber(this._value));
    } else {
      this.propagateChange(+this._value);
    }
  }

  constructor(private maskService: MaskService, private currencyPipe: CurrencyPipe) { }

  ngOnInit() {
    this.maskDecimal['integerLimit'] = this.integerLimit;
  }

  add() {
    this.value = (+this.value + 1).toString();
    this.changeEmitter.emit();
  }

  sub() {
    this.value = (+this.value - 1).toString();
    this.changeEmitter.emit();
  }

  valueAsNumber(): number {
    if (this.allowDecimal) { this.maskService.maskedValueToNumber(this._value); } else { return +this.value; }
  }

  blur() {
    this.blurEmitter.emit();
  }

  writeValue(obj: any): void {
    if (this.allowDecimal) {
      this.value = this.maskService.addDecimalMask(obj);
    } else {
      this.value = Math.round(obj).toString();
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void { }

  setDisabledState?(isDisabled: boolean): void { }
}
