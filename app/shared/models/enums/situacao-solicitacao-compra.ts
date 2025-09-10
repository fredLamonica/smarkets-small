export enum SituacaoSolicitacaoCompra {
  Nova = 1,
  Concluida = 2,
  Cancelada = 3,
  Disponivel = 4,
  Bloqueada = 5
}

// para usar:
// SituacaoSolicitacaoCompraCompraLabel.get(SituacaoSolicitacaoItemCompra[SituacaoSolicitacaoCompra.Nova])
export const SituacaoSolicitacaoCompraCompraLabel = new Map<number, string>([
  [1, 'Nova'],
  [2, 'Concluída'],
  [3, 'Cancelada'],
  [4, 'Disponível'],
  [5, 'Bloqueada']
]);
