import { TipoCatalogo } from '../../../shared/models/enums/tipo-catalogo';
import { FiltroLateralContrato } from './filtro-lateral-contrato';
import { FiltroSuperiorContrato } from './filtro-superior-contrato';
import { OrdenacaoContrato } from './ordenacao-contrato';


export class FiltroContrato {
  ordenacao: OrdenacaoContrato;
  empresa: number;
  tenant: number;
  tipoCatalogo: TipoCatalogo;
  filtroSuperior: FiltroSuperiorContrato;
  filtroLateral: FiltroLateralContrato;

  constructor(init?: Partial<FiltroContrato>) {
    Object.assign(this, init);
  }
}
