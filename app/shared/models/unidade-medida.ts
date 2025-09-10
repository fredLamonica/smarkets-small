export class UnidadeMedida {
  idUnidadeMedida: number;
  codigo: string;
  descricao: string;
  sigla: string;
  permiteQuantidadeFracionada: boolean;
  idTenant: number;

  constructor(init?: Partial<UnidadeMedida>) {
    Object.assign(this, init);
  }

}
