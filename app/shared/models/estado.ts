import { Pais } from './pais';

export class Estado {
  idEstado: number;
  idPais: number;
  nome: string;
  abreviacao: string;
  pais: Pais;

  constructor(init?: Partial<Estado>) {
    Object.assign(this, init);
  }

}
