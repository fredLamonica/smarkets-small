export class PedidoAlteracaoDto{
  id: number;
  codigo: string;

  constructor(init?: Partial<PedidoAlteracaoDto>) {
    Object.assign(this, init);
  }
}



