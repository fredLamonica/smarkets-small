import { Component, OnInit } from '@angular/core';
import { Acompanhamento } from './../acompanhamento';

@Component({
  selector: 'acompanhamento-pedido',
  templateUrl: './acompanhamento-pedido.component.html',
  styleUrls: ['./acompanhamento-pedido.component.scss']
})
export class AcompanhamentoPedidoComponent implements OnInit, Acompanhamento {
  constructor() {}

  ngOnInit() {}

  resetPaginacao() {
    throw new Error('Method not implemented.');
  }

  obter(termo?: string) {
    throw new Error('Method not implemented.');
  }

  onScroll(termo?: string, parametrosFiltroAvancado?: any[]) {
    throw new Error('Method not implemented.');
  }

  obterFiltroAvancado(any: any[]) {
    throw new Error('Method not implemented.');
  }
}
