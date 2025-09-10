import { TipoBuscaContrato } from './TipoBuscaContrato';

export class FiltroSuperiorContrato {
  termo: string = '';
  tipoBuscaContrato: TipoBuscaContrato;
  buscaDetalhada: boolean = false;

  constructor(init?: Partial<FiltroSuperiorContrato>) {
    Object.assign(this, init);
  }
}
