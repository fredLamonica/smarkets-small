import { AbstractControl, ValidatorFn } from '@angular/forms';

export function validDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value) {
      if (control.value.length > 10) {
        return {
          invalid: {
            message: 'Data inválida',
          },
        };
      }
    }

    return null;
  };
}
