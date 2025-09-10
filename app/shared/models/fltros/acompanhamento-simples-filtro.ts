import { FiltroBase } from './base/filtro-base';

export class AcompanhamentoSimplesFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<AcompanhamentoSimplesFiltro>) {
    super();
    Object.assign(this, init);
  }
}
