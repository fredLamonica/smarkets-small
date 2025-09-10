export enum SituacaoCartaResponsabilidadeFornecedor {
  Enviada = 1,
  Aprovada = 2,
  Recusada = 3
}

export const SituacaoCartaResponsabilidadeFornecedorLabel = new Map<number, string>([
  [1, 'Enviada'],
  [2, 'Aprovada'],
  [3, 'Recusada']
]);
