import { GestaoIntegracao } from './gestao-integracao';

export interface GestaoIntegracaoCondicaoPagamento extends GestaoIntegracao {
  idGestaoIntegracaoCondicaoPagamento: number;
  idCondicaoPagamento: number;
}
