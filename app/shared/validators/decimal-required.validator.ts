import { AbstractControl, ValidatorFn } from '@angular/forms';
import { UtilitiesService } from '../utils/utilities.service';

export function decimalRequiredValidator(onlyPositive: boolean = true): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value || (onlyPositive && new UtilitiesService().getNumberWithoutFormat(control.value) <= 0)) {
      return {
        required: {
          message: 'Preenchimento obrigatório',
        },
      };
    }

    return null;
  };
}
