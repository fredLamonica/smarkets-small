import { TipoCatalogo } from '../../../shared/models/enums/tipo-catalogo';
import { FiltroLateralMarketplace } from './filtro-lateral-marketplace';
import { FiltroSuperiorMarketplace } from './filtro-superior-marketplace';
import { OrdenacaoMarketplace } from './ordenacao-marketplace';

export class FiltroMarketplace {
  ordenacao: OrdenacaoMarketplace;
  empresa: number;
  tenant: number;
  tipoCatalogo: TipoCatalogo;
  filtroSuperior: FiltroSuperiorMarketplace;
  filtroLateral: FiltroLateralMarketplace;

  constructor(init?: Partial<FiltroMarketplace>) {
    Object.assign(this, init);
  }
}
