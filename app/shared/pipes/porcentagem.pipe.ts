import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'porcentagem',
})
export class PorcentagemPipe implements PipeTransform {

  constructor(
    private decimalPipe: DecimalPipe,
  ) { }

  transform(value: any, digitsInfo: any, locale: string): any {
    digitsInfo = digitsInfo ? digitsInfo : '1.2';
    const numero = this.decimalPipe.transform(value, digitsInfo, locale)

    return numero ? numero + '%' : '';
  }
}
