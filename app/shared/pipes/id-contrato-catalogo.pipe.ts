import { Pipe, PipeTransform } from '@angular/core';
import { ContratoCatalogo } from '../models';

@Pipe({
  name: 'idContratoCatalogoPipe',
})
export class IdContratoCatalogoPipe implements PipeTransform {

  constructor() { }

  transform(value: ContratoCatalogo): string {
    return value.idContratoCatalogoPai
      ? value.idContratoCatalogoPai +"."+ value.ordemClone
      : value.idContratoCatalogo.toString()
    ;
  }
}
