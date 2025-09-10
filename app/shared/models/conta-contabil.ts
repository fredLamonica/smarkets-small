export class ContaContabil {
  idContaContabil: number;
  idTenant: number;
  idContaContabilPai: number;
  codigo: string;
  descricao: string;
  filhos: Array<ContaContabil>;

  constructor(init?: Partial<ContaContabil>) {
    Object.assign(this, init);
  }
}
