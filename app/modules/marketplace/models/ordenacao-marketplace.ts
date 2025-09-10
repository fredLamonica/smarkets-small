export class OrdenacaoMarketplace {
  id: number;
  descricao: string;
  itemOrdenacao: string;
  ordem: string;

  constructor(init?: Partial<OrdenacaoMarketplace>) {
    Object.assign(this, init);
  }
}
