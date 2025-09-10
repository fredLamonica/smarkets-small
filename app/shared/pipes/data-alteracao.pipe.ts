import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataAlteracao'
})
export class DataAlteracaoPipe implements PipeTransform {
  constructor() {}

  transform(data: any, args?: any): any {
    let DataToCompare = new Date(Date.parse(data));
    let hoje = new Date();
    let ontem = new Date(hoje.getFullYear(),hoje.getMonth(), hoje.getDate() -1 );
    let day = DataToCompare.getDate() < 10 ? '0' + DataToCompare.getDate(): DataToCompare.getDate();
    let hours = DataToCompare.getHours() < 10 ? '0' + DataToCompare.getHours(): DataToCompare.getHours();
    let minutes = DataToCompare.getMinutes() < 10 ? '0' + DataToCompare.getMinutes(): DataToCompare.getMinutes();

    if (hoje.getDate() === DataToCompare.getDate() && hoje.getMonth() === DataToCompare.getMonth() && hoje.getFullYear() === DataToCompare.getFullYear() ) {
      return `Hoje ás ${hours} : ${minutes}`;
    } else if (ontem.getDate() === DataToCompare.getDate() && ontem.getMonth() === DataToCompare.getMonth() && ontem.getFullYear() === DataToCompare.getFullYear() ) {
      return `Ontem ás ${hours} : ${minutes}`;
    } else {
      let month = hoje.getMonth() + 1 < 10 ? '0' + (hoje.getMonth() + 1): hoje.getMonth() + 1;
      return `${day}/${month}/${hoje.getFullYear()} ás ${hours}: ${minutes}`;
    }
  }
}
