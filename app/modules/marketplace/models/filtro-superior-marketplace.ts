import { TipoBusca } from './tipo-busca.enum';

export class FiltroSuperiorMarketplace {
  termo: string = '';
  tipoBusca: TipoBusca;
  buscaDetalhada: boolean = false;

  constructor(init?: Partial<FiltroSuperiorMarketplace>) {
    Object.assign(this, init);
  }
}
