import { Pipe, PipeTransform } from '@angular/core';
import { PedidoItem } from '../models';
import { TipoCatalogo } from '../models/enums/tipo-catalogo';

@Pipe({
  name: 'descricaoCarrinhoCatalogo',
})
export class DescricaoCarrinhoCatalogoPipe implements PipeTransform {

  constructor(
  ) { }

  transform(pedidoItem: PedidoItem, idTenantLogado: number, index: number ): string {
    let codigoProduto: string;

    if (pedidoItem.contratoCatalogoItem.tipoCatalogo === TipoCatalogo['Catálogo Smarkets'] &&
      pedidoItem.contratoCatalogoItem.idTenant !== idTenantLogado) {
      codigoProduto = pedidoItem.produto.gestaoIntegracaoProduto ? pedidoItem.produto.gestaoIntegracaoProduto.codigoIntegracao + ' - ' : '';
    } else {
      codigoProduto = (pedidoItem.produto && pedidoItem.produto.codigo)? pedidoItem.produto.codigo + ' - ' : '';
    }

    return "ITEM " + (index + 1) + ": " + codigoProduto + pedidoItem.produto.descricao;
  }
}
