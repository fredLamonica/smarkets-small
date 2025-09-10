import { ContratoCatalogoItemEstado } from '../contrato-catalogo/contrato-catalogo-item-estado';
import { SituacaoContratoCatalogoItem } from '../enums/situacao-contrato-catalogo-item';
import { SituacaoContratoCatalogo } from './../enums/situacao-contrato-catalogo';

export class ContratoCatalogoFornecedorDto {

  idContratoCatalogo: number;
  idContratoCatalogoItem: number;
  idProduto: number;
  codigo: string;
  situacaoContratoCatalogo: SituacaoContratoCatalogo;
  situacaoContratoCatalogoItem: SituacaoContratoCatalogoItem;
  titulo: string;
  cliente: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  preco: string;
  quantidadeMinima: number;
  contratoCatalogoItemEstado: ContratoCatalogoItemEstado;
  justificativaRecusa: string;

   constructor(init?: Partial<ContratoCatalogoFornecedorDto>) {
    Object.assign(this, init);
  }
}
