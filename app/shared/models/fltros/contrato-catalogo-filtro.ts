import { SituacaoContratoCatalogo } from '../enums/situacao-contrato-catalogo';
import { ValidadeContratoCatalogo } from '../enums/validade-contrato-catalogo';
import { Estado } from '../estado';
import { TipoContratoCatalogo } from './../enums/tipo-contrato-catalogo';
import { FiltroBase } from './base/filtro-base';

export class ContratoCatalogoFiltro extends FiltroBase {

  termo: string;
  cnpj: string;
  razaoSocial: string;
  dataInicio: string;
  dataFim: string;
  situacao: SituacaoContratoCatalogo;
  idContratoCatalogo: number;
  TipoContratoCatalogo: TipoContratoCatalogo;
  responsavel: string;
  gestor: string;
  codigo: string;
  objeto: string;
  uf: Estado;
  faturamentoMinimo: string;
  validade: ValidadeContratoCatalogo;

  constructor(init?: Partial<ContratoCatalogoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
