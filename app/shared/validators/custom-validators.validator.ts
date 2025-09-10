import { AbstractControl } from '@angular/forms';
import { UtilitiesService } from '../utils/utilities.service';

export function cpf(control: AbstractControl) {
  let valor = control.value;
  valor = valor.replace(/[^\d]+/g, '');

  let soma;
  let resto;

  soma = 0;

  if (
    valor.match('0{9}') ||
    valor.match('1{9}') ||
    valor.match('2{9}') ||
    valor.match('3{9}') ||
    valor.match('4{9}') ||
    valor.match('5{9}') ||
    valor.match('6{9}') ||
    valor.match('7{9}') ||
    valor.match('8{9}') ||
    valor.match('9{9}')
  ) {
    return { invalidCpf: true };
  }

  for (let i = 1; i <= 9; i++) { soma = soma + parseInt(valor.substring(i - 1, i)) * (11 - i); }
  resto = (soma * 10) % 11;

  if (resto == 10 || resto == 11) { resto = 0; }
  if (resto != parseInt(valor.substring(9, 10))) { return { invalidCpf: true }; }

  soma = 0;
  for (let i = 1; i <= 10; i++) { soma = soma + parseInt(valor.substring(i - 1, i)) * (12 - i); }
  resto = (soma * 10) % 11;

  if (resto == 10 || resto == 11) { resto = 0; }
  if (resto != parseInt(valor.substring(10, 11))) { return { invalidCpf: true }; }

  return null;
}

export function cnpj(control: AbstractControl) {
  let valor: String = control.value;
  let tamanho: number;
  let numeros: String;
  let digitos: String;
  let soma: number;
  let pos: number;
  let resultado: number;

  valor = valor.replace(/[^\d]+/g, '');

  if (valor == '') { return { invalidCnpj: true }; }

  if (valor.length != 14) { return { invalidCnpj: true }; }

  if (
    valor.match('0{14}') ||
    valor.match('1{14}') ||
    valor.match('2{14}') ||
    valor.match('3{14}') ||
    valor.match('4{14}') ||
    valor.match('5{14}') ||
    valor.match('6{14}') ||
    valor.match('7{14}') ||
    valor.match('8{14}') ||
    valor.match('9{14}')
  ) {
    return { invalidCnpj: true };
  }

  tamanho = valor.length - 2;
  numeros = valor.substring(0, tamanho);
  digitos = valor.substring(tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) { pos = 9; }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado != +digitos.charAt(0)) { return { invalidCnpj: true }; }

  tamanho = tamanho + 1;
  numeros = valor.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += +numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) { pos = 9; }
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);

  if (resultado != +digitos.charAt(1)) { return { invalidCnpj: true }; }

  return null;
}

export function cpfCnpj(control: AbstractControl) {
  const valor: String = control.value;
  if (valor.length > 14) { return cnpj(control); } else { return cpf(control); }
}

export function ncm(control: AbstractControl) {
  const valor: String = control.value;
  if (valor && valor.length != 8) { return { invalidNcm: true }; }
  return null;
}

export function decimalRequiredValidator(control: AbstractControl) {
  if (!control.value || (new UtilitiesService().getNumberWithoutFormat(control.value) <= 0)) {
    return { invalidPositiveDecimal: true };
  }

  return null;
}
