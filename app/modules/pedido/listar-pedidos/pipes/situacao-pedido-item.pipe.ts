import { Pipe, PipeTransform } from '@angular/core';
import { SituacaoPedido } from '../../../../shared/models';

@Pipe({
  name: 'situacaoPedidoItem',
})
export class SituacaoPedidoItemPipe implements PipeTransform {

  transform(situacaoPedidoItem: SituacaoPedido): any {
    return SituacaoPedido[situacaoPedidoItem];
  }
}
