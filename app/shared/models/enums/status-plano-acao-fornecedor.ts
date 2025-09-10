export enum StatusPlanoAcaoFornecedor {
  'Em Andamento' = 1,
  Finalizado = 2,
  Pendente = 3,
  Atrasado = 4
}

export const StatusPlanoAcaoFornecedorLabel = new Map<number, string>([
  [StatusPlanoAcaoFornecedor['Em Andamento'], 'Em Andamento'],
  [StatusPlanoAcaoFornecedor.Finalizado, 'Finalizado'],
  [StatusPlanoAcaoFornecedor.Pendente, 'Pendente'],
  [StatusPlanoAcaoFornecedor.Atrasado, 'Atrasado']
]);
