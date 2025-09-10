export class EntregaProgramada {

  // O ID pode ser o do item de uma entrega programada de requisição ou de pedido.
  id: number;

  // O ID do item pode ser o de uma RequisicaoItem ou de um PedidoItem.
  idItem: number;

  dataEntrega: string;
  dataEntregaValida: boolean;
  quantidade: number;
  valor: number;

  get valorTotal(): number {
    this._valorTotal = +this.valor * +this.quantidade;
    return this._valorTotal;
  }
  set valorTotal(valorTotal: number) {
    this._valorTotal = valorTotal;
  }

  get idPedidoEntregasProgramadas(): number {
    return this.id;
  }
  set idPedidoEntregasProgramadas(idPedidoEntregasProgramadas: number) {
    this.id = idPedidoEntregasProgramadas;
  }

  get idRequisicaoEntregasProgramadas(): number {
    return this.id;
  }
  set idRequisicaoEntregasProgramadas(idRequisicaoEntregasProgramadas: number) {
    this.id = idRequisicaoEntregasProgramadas;
  }

  get idPedidoItem(): number {
    return this.idItem;
  }
  set idPedidoItem(idPedidoItem: number) {
    this.idItem = idPedidoItem;
  }

  get idRequisicaoItem(): number {
    return this.idItem;
  }
  set idRequisicaoItem(idRequisicaoItem: number) {
    this.idItem = idRequisicaoItem;
  }

  private _valorTotal: number;

  constructor(init?: Partial<EntregaProgramada>) {
    Object.assign(this, init);
  }

  flatOut(): any {
    return {
      idPedidoEntregasProgramadas: +this.idPedidoEntregasProgramadas,
      idRequisicaoEntregasProgramadas: +this.idRequisicaoEntregasProgramadas,
      idPedidoItem: +this.idPedidoItem,
      idRequisicaoItem: +this.idRequisicaoItem,
      dataEntrega: this.dataEntrega,
      quantidade: +this.quantidade,
      valor: +this.valor,
    };
  }

}
