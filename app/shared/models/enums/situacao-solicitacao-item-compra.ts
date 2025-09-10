export enum SituacaoSolicitacaoItemCompra {
  Nova = 1,
  Aberta = 2,
  Concluida = 3,
  Cancelada = 4,
  Disponivel = 5,
  Bloqueada = 6,
  "Disponível em Pre-pedido" = 7
}

// para usar:
// SituacaoSolicitacaoItemCompraLabel.get(SituacaoSolicitacaoItemCompra[1]) ou
// SituacaoSolicitacaoCompraCompraLabel.get(SituacaoSolicitacaoItemCompra[SituacaoSolicitacaoCompra.Nova])

export const SituacaoSolicitacaoItemCompraLabel = new Map<number, string>([
  [1, 'Nova'],
  [2, 'Aberta'],
  [3, 'Concluída'],
  [4, 'Cancelada'],
  [5, 'Disponível'],
  [6, 'Bloqueada'],
  [7, 'Disponível em Pre-pedido']
]);
