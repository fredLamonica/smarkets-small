import { Pipe, PipeTransform } from '@angular/core';
import { SituacaoRequisicaoItem } from '../../../../../shared/models/enums/situacao-requisicao-item';

@Pipe({
  name: 'situacaoRequisicaoItem',
})
export class SituacaoRequisicaoItemPipe implements PipeTransform {

  transform(situacaoRequisicaoItem: SituacaoRequisicaoItem): any {
    return SituacaoRequisicaoItem[situacaoRequisicaoItem];
  }

}
