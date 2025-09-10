import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoArquivoFiltro extends FiltroBase {

  termo: string;
  idContratoCatalogo: number;

  constructor(init?: Partial<ContratoCatalogoArquivoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
