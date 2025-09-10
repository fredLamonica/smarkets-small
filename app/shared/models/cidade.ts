import { Estado } from './estado';

export class Cidade {
  idCidade: number;
  idEstado: number;
  nome: string;
  estado: Estado;

  constructor(init?: Partial<Cidade>) {
    Object.assign(this, init);
  }
}
