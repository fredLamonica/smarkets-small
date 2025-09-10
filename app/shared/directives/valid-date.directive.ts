import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator } from '@angular/forms';
import { validDateValidator } from '../validators/valid-date.validator';

@Directive({
  selector: '[appValidDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: ValidDateDirective, multi: true }],
})
export class ValidDateDirective implements Validator {

  @Input() appDateRange: any;

  validate(control: AbstractControl): { [key: string]: any } | null {
    return this.appDateRange
      ? validDateValidator()(control)
      : null;
  }

}
