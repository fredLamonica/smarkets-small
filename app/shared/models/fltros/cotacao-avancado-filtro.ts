import { FiltroBase } from './base/filtro-base';

export class CotacaoAvancadoFiltro extends FiltroBase {

  idCotacao: number;
  termoDescricaoCotacao: string;
  termoCompradorResponsavel: string;
  termoStatus: string;

  constructor(init?: Partial<CotacaoAvancadoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
