import { Observable } from 'rxjs';
import { FluxoIntegracaoErp } from '../fluxo-integracao-erp';
import { Paginacao } from '../paginacao';

export interface FluxoIntegracaoErpService {

  get(id: number, itensPorPagina: number, pagina: number): Observable<Paginacao<FluxoIntegracaoErp>>;

  resend(id: number, idFluxoIntegracaoErp: number): Observable<number>;

}
