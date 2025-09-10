import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmValueValidator(controlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const controlValue = group.get(controlName).value;
    const controlConfirmValue = group.get(`${controlName}Confirm`).value;

    if (controlValue !== controlConfirmValue) {
      return {
        notSame: {
          message: 'Os valores não são iguais',
        },
      };
    }

    return null;
  };
}
