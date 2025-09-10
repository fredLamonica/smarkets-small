import { FiltroBase } from './base/filtro-base';

export class DocumentoFornecedorFiltro extends FiltroBase {

  termo: string;

  constructor(init?: Partial<DocumentoFornecedorFiltro>) {
    super();
    Object.assign(this, init);
  }
}
