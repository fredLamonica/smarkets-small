import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';
import { Estado } from '../estado';

export class ContratoCatalogoItemEstado {
  idContratoCatalogoItemEstado: number;
  idContratoCatalogoItem: number;
  idContratoCatalogo: number;
  idEstado: number;
  estado: Estado;
  situacao: SituacaoContratoCatalogoItem;
  idTenant: number;
  prazoEntregaDias: number;

   constructor(idContratoCatalogo: number, situacao: number, idEstado: number, prazoEntregaDias: number) {
    this.idContratoCatalogo = idContratoCatalogo;
    this.situacao = situacao;
    this.idEstado = idEstado;
    this.prazoEntregaDias = prazoEntregaDias;
  }
}


