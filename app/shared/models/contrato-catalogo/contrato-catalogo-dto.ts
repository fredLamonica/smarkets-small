import { SituacaoContratoCatalogo } from '../enums/situacao-contrato-catalogo';
import { ValidadeContratoCatalogo } from '../enums/validade-contrato-catalogo';
import { TipoContratoCatalogo } from './../enums/tipo-contrato-catalogo';

export class ContratoCatalogoDto {
  idContratoCatalogo: number;
  possuiAlteracao: boolean;
  clonagem: boolean;
  codigo: string;
  titulo: string
  objeto: string;
  fornecedor: string;
  cnpj: string;
  idContratoCatalogoPai: number;
  ordemClone: number;
  dataInicio: Date;
  dataFim: Date;
  situacao: SituacaoContratoCatalogo;
  validade: ValidadeContratoCatalogo;
  tipoContratoCatalogo: TipoContratoCatalogo;
}
