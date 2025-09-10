import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';
import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoItemFiltro extends FiltroBase {

  idContratoCatalogo: number;
  termo: string;
  filtroAvancado: boolean;
  situacao: SituacaoContratoCatalogoItem;
  codigo: String;
  marca: String;

  constructor(init?: Partial<ContratoCatalogoItemFiltro>) {
    super();
    Object.assign(this, init);
  }
}
