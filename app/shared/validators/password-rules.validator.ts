import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordRulesValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const messages: Array<string> = new Array<string>();

    let password: string = control.value;

    if (!password) {
      password = '';
    }

    if (password.length < minLength) {
      messages.push(`A senha deve conter no mínimo ${minLength} caracteres`);
    }

    if (!/[a-z]/.test(password)) {
      messages.push('A senha deve conter letra minúscula');
    }

    if (!/[A-Z]/.test(password)) {
      messages.push('A senha deve conter letra maiúscula');
    }

    if (!/\d/.test(password)) {
      messages.push('A senha deve conter número');
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      messages.push('A senha deve conter caractere especial');
    }

    if (messages.length > 0) {
      return {
        passwordRules: {
          messages,
        },
      };
    }

    return null;
  };
}
