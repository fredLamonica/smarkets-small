import { ReturnStatement } from '@angular/compiler';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumToArray'
})
export class EnumToArrayPipe implements PipeTransform {
  transform(value): Object {
    if (value == undefined || value == null) return;
    return Object.keys(value)
      .filter(e => !isNaN(+e))
      .map(o => {
        return { index: Number(+o), name: value[o] };
      });
  }
}
