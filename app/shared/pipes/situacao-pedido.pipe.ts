import { Pipe, PipeTransform } from '@angular/core';
import { PerfilUsuario, SituacaoPedido } from '@shared/models';
import { AutenticacaoService } from '@shared/providers';

@Pipe({
  name: 'situacaoPedido',
})
export class SituacaoPedidoPipe implements PipeTransform {
  constructor(private authService: AutenticacaoService) { }

  transform(value: any, args?: any): any {
    const perfil = this.authService.perfil();
    switch (perfil) {
      case PerfilUsuario.Fornecedor:
        return this.fornecedor(value);
      default:
        return this.requisitante(value);
    }
  }

  private requisitante(situacao: SituacaoPedido): string {
    switch (situacao) {
      case SituacaoPedido['Aguardando fornecedor']:
        return 'Aguardando pré-aprovação do fornecedor';
      case SituacaoPedido['Aguardando requisitante']:
        return 'Aguardando revisão do requisitante';
      case SituacaoPedido['Aguardando aprovação']:
        return 'Aguardando aprovação interna';
      case SituacaoPedido.Aprovado:
        return 'Aguardando confirmação do fornecedor';
      case SituacaoPedido.Confirmado:
        return 'Confirmado pelo fornecedor';
      case SituacaoPedido.Preparado:
        return 'Preparado para envio';
      case SituacaoPedido.Entregue:
        return 'Recebido';
      case SituacaoPedido['Entregue Parcialmente']:
        return 'Recebido Parcialmente';
      default:
        return SituacaoPedido[situacao];
    }
  }

  private fornecedor(situacao: SituacaoPedido): string {
    switch (situacao) {
      case SituacaoPedido['Aguardando fornecedor']:
        return 'Aguardando pré-aprovação do fornecedor';
      case SituacaoPedido['Aguardando requisitante']:
        return 'Aguardando revisão do requisitante';
      case SituacaoPedido['Aguardando aprovação']:
        return 'Aguardando aprovação do cliente';
      case SituacaoPedido.Aprovado:
        return 'Aguardando confirmação do fornecedor';
      case SituacaoPedido.Confirmado:
        return 'Confirmado pelo fornecedor';
      case SituacaoPedido.Preparado:
        return 'Preparado para envio';
      case SituacaoPedido.Entregue:
        return 'Entregue';
      case SituacaoPedido['Entregue Parcialmente']:
        return 'Entregue Parcialmente';
      default:
        return SituacaoPedido[situacao];
    }
  }

}
