import { Produto } from '../produto';
import { ContratoCatalogoItem } from './../contrato-catalogo/contrato-catalogo-item';
import { TipoCatalogoItem } from './../enums/tipo-catalogo-item';

export class CatalogoItem {
  tipo: TipoCatalogoItem;
  prazoSLA: number;
  idProdutoFavorito?: number;
  contratoCatalogoItem: ContratoCatalogoItem;
  produto: Produto;
  menorPrazoEmDias: number;
}
