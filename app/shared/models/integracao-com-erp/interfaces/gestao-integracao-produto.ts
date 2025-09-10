import { GestaoIntegracao } from './gestao-integracao';

export interface GestaoIntegracaoProduto extends GestaoIntegracao {
  idGestaoIntegracaoProduto: number;
  idProduto: number;
}
