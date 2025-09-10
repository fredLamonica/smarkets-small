import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SituacaoPedido } from '../../../../shared/models';

@Directive({
  selector: '[smkSituacaoPedidoItem]',
})
export class SituacaoPedidoItemDirective implements OnInit {

  @Input() situacaoPedidoItem: SituacaoPedido;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.processeSituacao();
  }

  private processeSituacao(): void {
    let classe: string;

    switch (this.situacaoPedidoItem) {
      case SituacaoPedido['Pré-pedido']:
      case SituacaoPedido['Preparado']:
      case SituacaoPedido['Enviado']:
      case SituacaoPedido['Pendente integração']:
      case SituacaoPedido['Aguardando Integracao API']:
      case SituacaoPedido['Entregue Parcialmente']:
        classe = 'info';
        break;

      case SituacaoPedido.Confirmado:
      case SituacaoPedido.Entregue:
        classe = 'success';
        break;

      case SituacaoPedido.Aprovado:
      case SituacaoPedido['Aguardando fornecedor']:
      case SituacaoPedido['Aguardando requisitante']:
      case SituacaoPedido['Aguardando aprovação']:
      case SituacaoPedido['Aguardando Pacote']:
      case SituacaoPedido['Aguardando Integração Requisição']:
      case SituacaoPedido['Aguardando Integração']:
      case SituacaoPedido['Aguardando Aprovação Externa']:
        classe = 'warning';
        break;

      case SituacaoPedido['Integração Requisição Cancelada']:
      case SituacaoPedido['Erro de Integração']:
        classe = 'danger';
        break;

      case SituacaoPedido.Cancelado:
      case SituacaoPedido['Cancelamento Solicitado']:
      case SituacaoPedido['Faturado']:
        classe = 'secondary';
        break;
    }

    this.el.nativeElement.classList.add(classe);
  }
}
