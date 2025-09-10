
export class EstadoAtendimento {

  prazoDeEntregaEmDias: number;
  dataPrevistaDeEntrega: string;
  faturamentoMinimo: number;
  idContratoCatalogo: number;
  idContratoCatalogoItem: number;
  estadoDeAtendimentoInvalido: boolean;
  estadoDeAtendimentoMensagemDeErro: string;

  constructor(init?: Partial<EstadoAtendimento>) {
    Object.assign(this, init);
  }

}
