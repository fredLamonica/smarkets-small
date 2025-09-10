import { Pipe, PipeTransform } from '@angular/core';
import { Moeda } from '@shared/models';

@Pipe({
  name: 'moedaLocale'
})
export class MoedaLocalePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case Moeda.Real:
        return "pt-BR";
      default:
        return "en-US";
    }
  }

}
