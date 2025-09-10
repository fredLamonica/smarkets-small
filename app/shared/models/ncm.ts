export class Ncm {

  idNcm: number;
  codigo: string;
  descricao: string;

  constructor(init?: Partial<Ncm>) {
    Object.assign(this, init);
  }
}
