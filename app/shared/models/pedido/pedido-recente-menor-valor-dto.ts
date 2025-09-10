import { Moeda } from '..';

export class PedidoRecenteMenorValorDto {
  valor: number;
  moeda: Moeda;
  razaoSocialFornecedor: string;
  dataCompra: Date;
  quantidadeCompra: number;
}
