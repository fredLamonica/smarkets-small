export class EntregaProgramadaUltimaData {

  idRequisicaoItem: number;
  ultimaDataEntrega: string;
  quantidadeDias: number;
  ultimaDataEntregaDias: string;

  constructor(init?: Partial<EntregaProgramadaUltimaData>) {
    Object.assign(this, init);
  }

}
