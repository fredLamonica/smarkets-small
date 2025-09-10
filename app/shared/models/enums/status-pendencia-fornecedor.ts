export enum StatusPendenciaFornecedor {
  Pendente = 1,
  Resolvido = 2,
  Excluído = 3
}

export const StatusPendenciaFornecedorLabel = new Map<number, string>([
  [StatusPendenciaFornecedor.Pendente, 'Em Andamento'],
  [StatusPendenciaFornecedor.Resolvido, 'Resolvido'],
  [StatusPendenciaFornecedor.Excluído, 'Excluído']
]);
