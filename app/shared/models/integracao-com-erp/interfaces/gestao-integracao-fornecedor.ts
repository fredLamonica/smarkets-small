import { GestaoIntegracao } from './gestao-integracao';

export interface GestaoIntegracaoFornecedor extends GestaoIntegracao {
  idGestaoIntegracaoFornecedor: number;
  idFornecedor: number;
}
