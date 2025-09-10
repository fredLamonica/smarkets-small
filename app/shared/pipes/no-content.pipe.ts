import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noContent'
})
export class NoContentPipe implements PipeTransform {
  transform(value: any, args: any = '--'): any {
    if (value) {
      return value;
    } else {
      return args;
    }
  }
}
