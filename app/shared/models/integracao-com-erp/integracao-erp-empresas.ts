import { GestaoIntegracaoEmpresa } from './gestao-integracao-empresa';

export class IntegracaoErpEmpresas {
  codigoIntegracao: string;
  empresas: Array<GestaoIntegracaoEmpresa>;

  constructor(init?: Partial<IntegracaoErpEmpresas>) {
    Object.assign(this, init);
  }
}
