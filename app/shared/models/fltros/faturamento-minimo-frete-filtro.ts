import { FiltroBase } from './base/filtro-base';

export class FaturamentoMinimoFreteFiltro extends FiltroBase {

  termo: string;
  idPessoa: number;

  constructor(init?: Partial<FaturamentoMinimoFreteFiltro>) {
    super();
    Object.assign(this, init);
  }
}
