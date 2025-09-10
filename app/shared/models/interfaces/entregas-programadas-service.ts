import { Observable } from 'rxjs';
import { EntregaProgramada } from '../entrega-programada';
import { Paginacao } from '../paginacao';

export interface EntregasProgramadasService {

  get(idItem: number, itensPorPagina: number, pagina: number): Observable<Paginacao<EntregaProgramada>>;

  post(entregaProgramada: EntregaProgramada): Observable<Array<EntregaProgramada>>;

  put(entregaProgramada: EntregaProgramada): Observable<Array<EntregaProgramada>>;

  delete(idsEntregasProgramadas: Array<number>): Observable<number>;

}
