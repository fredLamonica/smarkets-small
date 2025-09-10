import { Pipe, PipeTransform } from '@angular/core';
import { Moeda } from '../models/enums/moeda';

@Pipe({
  name: 'moedaCodigo',
})
export class MoedaCodigoPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case Moeda.Real:
        return 'BRL';
      case Moeda['Dólar Americano']:
        return 'USD';
      case Moeda['Libra Esterlina']:
        return 'GBP';
      case Moeda.Euro:
        return 'EUR';
      case Moeda['Iene Japonês']:
        return 'JPY';
      case Moeda['Franco Suiço']:
        return 'CHF';
      case Moeda['Dólar Australiano']:
        return 'AUD';
      case Moeda['Dólar Canadense']:
        return 'CAD';
      case Moeda['Iuane Chinês']:
        return 'CNY';
      case Moeda.Peso:
        return 'ARS';
      default:
        return '$';
    }
  }

}
