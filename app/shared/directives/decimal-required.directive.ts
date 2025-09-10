import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { decimalRequiredValidator } from '../validators/decimal-required.validator';

@Directive({
  selector: '[appDecimalRequired]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DecimalRequiredDirective, multi: true }],
})
export class DecimalRequiredDirective implements Validator {

  @Input() appDecimalRequired: any;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return decimalRequiredValidator(this.appDecimalRequired)(control);
  }

}
