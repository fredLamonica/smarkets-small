export class GestaoIntegracaoEmpresa {
  idPessoaJuridica: number;
  razaoSocial: string;
  cnpj: string;

  constructor(init?: Partial<GestaoIntegracaoEmpresa>) {
    Object.assign(this, init);
  }
}
