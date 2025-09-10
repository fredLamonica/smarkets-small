import { FiltroBase } from './base/filtro-base';

export class AprovacaoNivelFiltro extends FiltroBase {

  termo: string;
  idDepartamento: number;
  idNivel: number;

  constructor(init?: Partial<AprovacaoNivelFiltro>) {
    super();
    Object.assign(this, init);
  }
}
