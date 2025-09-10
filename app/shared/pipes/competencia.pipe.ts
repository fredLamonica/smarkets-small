import { Pipe, PipeTransform } from '@angular/core';
import { Competencia } from '../models/enums/competencia-relatorio-requisicao.enum';

@Pipe({
  name: 'competencia',
})
export class CompetenciaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    switch (value) {
      case Competencia.dataAprovacaoPedido:
        return 'Data de aprovação do Pedido';

      case Competencia.dataAprovacaoRequisicao:
        return 'Data de aprovação da Requisição';

      case Competencia.dataConfirmacaoFornecedor:
        return 'Data de confirmação do Fornecedor';

      case Competencia.dataCriacaoPedido:
        return 'Data de criação do Pedido';

      case Competencia.dataCriacaoRequisicao:
        return 'Data de criação da Requisição';

      case Competencia.dataEntregaBaixaPedido:
        return 'Data de entrega (baixa do Pedido)';

      default:
        return CompetenciaPipe[value];
    }
  }

}
