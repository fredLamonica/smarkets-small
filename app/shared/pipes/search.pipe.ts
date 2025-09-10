import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {

  // tslint:disable-next-line: no-shadowed-variable
  transform(value: any, search: string, compareTo?: Function): any {
      if (!value) {return null; }
      if (!search) { return value; }

      if (!compareTo) {
        compareTo = (item: any, search: string) => JSON.stringify(item).toLowerCase().includes(search.toLowerCase());
      }

      return value.filter((item) => compareTo(item, search));
  }
}
