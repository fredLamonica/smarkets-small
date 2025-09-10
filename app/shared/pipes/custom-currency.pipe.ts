import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { Moeda } from '../models/enums/moeda';
import { MoedaCodigoPipe } from './moeda-codigo.pipe';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {

  constructor(
    private currencyPipe: CurrencyPipe,
    private moedaCodigoPipe: MoedaCodigoPipe,
  ) { }

  transform(value: any, moeda: Moeda, digistInfo: any, display: any): any {
    moeda = moeda ? moeda : Moeda.Real;
    digistInfo = digistInfo ? digistInfo : '1.2';
    display = display ? display : '';

    return this.currencyPipe.transform(value ? value : 0, this.moedaCodigoPipe.transform(moeda), display, digistInfo, 'pt-BR');
  }

}
