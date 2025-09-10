import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cnpjCpf'
})
export class CnpjCpfPipe implements PipeTransform {
  constructor() {}

  transform(value: any, args?: any): any {
    let numeros = value.replace(/\D/g, '');
    if (numeros.length <= 11) {
      return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
      return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
  }
}
