export class CarrinhoResumo {

  valor: number;
  quantidadeItensRequisicao: number;
  quantidadeItensCatalogo: number;
  quantidadeItensRegularizacao: number;

  constructor(init?: Partial<CarrinhoResumo>) {
    Object.assign(this, init);
  }
}
