import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { SituacaoRequisicaoItem } from '../../../../../shared/models/enums/situacao-requisicao-item';

@Directive({
  selector: '[smkSituacaoRequisicaoItem]',
})
export class SituacaoRequisicaoItemDirective implements OnInit {

  @Input() situacaoRequisicaoItem: SituacaoRequisicaoItem;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.processeSituacao();
  }

  private processeSituacao(): void {
    let classe: string;

    switch (this.situacaoRequisicaoItem) {
      case SituacaoRequisicaoItem['Pré Requisição']:
      case SituacaoRequisicaoItem['Em Configuração']:
      case SituacaoRequisicaoItem['Em Cotação']:
        classe = 'info';
        break;

      case SituacaoRequisicaoItem.Aprovado:
        classe = 'success';
        break;

      case SituacaoRequisicaoItem['Aguardando Aprovação Interna']:
      case SituacaoRequisicaoItem['Aguardando Pacote']:
      case SituacaoRequisicaoItem['Aguardando Integração Requisição']:
      case SituacaoRequisicaoItem['Aguardando Integração']:
        classe = 'warning';
        break;

      case SituacaoRequisicaoItem.Recusado:
      case SituacaoRequisicaoItem['Integração Requisição Cancelada']:
      case SituacaoRequisicaoItem['Erro de Integração']:
        classe = 'danger';
        break;

      case SituacaoRequisicaoItem.Finalizado:
      case SituacaoRequisicaoItem.Cancelado:
      case SituacaoRequisicaoItem.Vinculado:
        classe = 'secondary';
        break;
    }

    this.el.nativeElement.classList.add(classe);
  }

}
