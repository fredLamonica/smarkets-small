import { CurrencyPipe, DatePipe, DecimalPipe, LowerCasePipe, PercentPipe, UpperCasePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { ColumnTypeEnum } from '../models/column-type.enum';

@Pipe({
  name: 'column',
})
export class ColumnPipe implements PipeTransform {

  private readonly locale: string = 'pt-BR';
  private readonly datePattern: string = 'dd/MM/yyyy';
  private readonly timePattern: string = 'HH:mm';
  private readonly digitsInfo: string = '1.0-2';

  transform(value: any, columnType: ColumnTypeEnum): any {
    switch (columnType) {
      case ColumnTypeEnum.Text:
        return value;

      case ColumnTypeEnum.TextLowerCase:
        return new LowerCasePipe().transform(value);

      case ColumnTypeEnum.TextUpperCase:
        return new UpperCasePipe().transform(value);

      case ColumnTypeEnum.Date:
        return new DatePipe(this.locale).transform(value, this.datePattern);

      case ColumnTypeEnum.Time:
        return new DatePipe(this.locale).transform(value, this.timePattern);

      case ColumnTypeEnum.DateTime:
        return new DatePipe(this.locale).transform(value, `${this.datePattern} ${this.timePattern}`);

      case ColumnTypeEnum.Decimal:
        return new DecimalPipe(this.locale).transform(value, this.digitsInfo);

      case ColumnTypeEnum.Percent:
        return new PercentPipe(this.locale).transform(value, this.digitsInfo);

      case ColumnTypeEnum.Currency:
        return new CurrencyPipe(this.locale).transform(value, 'BRL', 'symbol', this.digitsInfo);
    }
  }

}
