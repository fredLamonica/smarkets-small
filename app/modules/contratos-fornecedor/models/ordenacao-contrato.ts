export class OrdenacaoContrato {
  id: number;
  descricao: string;
  itemOrdenacao: string;
  ordem: string;

  constructor(init?: Partial<OrdenacaoContrato>) {
    Object.assign(this, init);
  }
}
