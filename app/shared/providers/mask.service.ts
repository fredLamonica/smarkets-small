import { Injectable } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { DecimalPipe } from '@angular/common';

@Injectable()
export class MaskService {
  constructor(private decimalPipe: DecimalPipe) {}

  public positiveDecimalMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: '.',
    allowDecimal: true,
    decimalSymbol: ',',
    decimalLimit: 4,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9
  });

  public positiveIntegerMask = createNumberMask({
    prefix: '',
    suffix: '',
    includeThousandsSeparator: false,
    thousandsSeparatorSymbol: null,
    allowDecimal: false,
    decimalSymbol: ',',
    decimalLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false,
    integerLimit: 9
  });

  public rmDecimalMask(value: any): number {
    if (value != undefined && value != null) {
      if (isNaN(value)) {
        return +value.replace(/\./g, '').replace(',', '.');
      } else {
        return value;
      }
    }
  }

  public addDecimalMask(value: any): string {
    if (value != null) {
      return this.decimalPipe.transform(value, '1.0-10', 'pt-BR').trim();
    }
  }

  public maskedValueToNumber(value: any): number {
    if (typeof value === 'string') {
      const stringValue = value.toString();
      let regX = /\./gi;
      return +stringValue.replace(regX, '').replace(',', '.');
    }
    return isNaN(+value) ? 0 : +value;
  }
}
