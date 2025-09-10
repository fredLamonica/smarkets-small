import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Unsubscriber } from '@shared/components/base/unsubscriber';
import { SituacaoProduto } from '@shared/models';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProdutoEmpresaBase } from '../../../../shared/models/produto-empresa-base';

@Component({
  selector: 'app-item-produto-empresa-base',
  templateUrl: './item-produto-empresa-base.component.html',
  styleUrls: ['./item-produto-empresa-base.component.scss'],
})
export class ItemProdutoEmpresaBaseComponent extends Unsubscriber implements OnInit {

  @BlockUI() blockUI: NgBlockUI;

  @Input() produto: ProdutoEmpresaBase;
  @Input() selecaoHabilitada: boolean;
  @Input() empresaBaseEhHolding: boolean;

  @Output() changeItem = new EventEmitter<ProdutoEmpresaBase>();

  situacao = SituacaoProduto;

  constructor() {
    super();
  }

  ngOnInit() { }

  click() {
    if (this.selecaoHabilitada) {
      this.alterneSelecao();
    }
  }

  alterneSelecao() {
    this.produto.selected = !this.produto.selected;
    this.changeItem.emit(this.produto);
  }

  getLabelSituacao(situacao: SituacaoProduto): string {
    if (situacao) {
      return SituacaoProduto[situacao];
    }

    return '';
  }

}
