export class ContaContabilDto {
  idContaContabil: number;
  codigo: string;
  descricao: string;

  constructor(init?: Partial<ContaContabilDto>) {
    Object.assign(this, init);
  }
}
