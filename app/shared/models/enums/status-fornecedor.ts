export enum StatusFornecedor {
  Bloqueado = 1,
  Novo = 2,
  AtivoComPendencias = 3,
  EmAnalise = 4,
  Ativo = 5,
  Inativo = 6,
  EmConfiguracao = 7,
}

// para usar:
// statusFornecedorLabel = StatusFornecedorLabel;
// statusFornecedorLabel.get(item).valueOf();
export const StatusFornecedorLabel = new Map<number, string>([
  [1, 'Bloqueado'],
  [2, 'Novo'],
  [3, 'Ativo com pendências'],
  [4, 'Em análise'],
  [5, 'Ativo'],
  [6, 'Inativo'],
  [7, 'Em configuração'],
]);
