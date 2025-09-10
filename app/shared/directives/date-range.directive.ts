import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { dateRangeValidator } from '../validators/date-range.validator';

@Directive({
  selector: '[appDateRange]',
  providers: [{ provide: NG_VALIDATORS, useExisting: DateRangeDirective, multi: true }],
})
export class DateRangeDirective implements Validator {

  @Input() appDateRange: any;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.appDateRange
      ? dateRangeValidator(this.appDateRange.minDate, this.appDateRange.maxDate)(control)
      : null;
  }

}
