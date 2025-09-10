export enum SituacaoPendenciaFornecedorCor {
  Pendente = 1,
  Resolvida = 2
}

export const SituacaoPendenciaFornecedorCorLabel = new Map<number, string>([
  [SituacaoPendenciaFornecedorCor.Pendente, 'Pendente'],
  [SituacaoPendenciaFornecedorCor.Resolvida, 'Resolvida']
]);
