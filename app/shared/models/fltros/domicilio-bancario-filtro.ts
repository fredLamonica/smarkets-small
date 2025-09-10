import { FiltroBase } from './base/filtro-base';

export class DomicilioBancarioFiltro extends FiltroBase {

  termo: string;
  idPessoa: number;

  constructor(init?: Partial<DomicilioBancarioFiltro>) {
    super();
    Object.assign(this, init);
  }
}
