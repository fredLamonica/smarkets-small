export enum SituacaoQuestionarioFornecedor {
  Pendente = 1,
  'Em Andamento' = 2,
  Respondido = 3,
  Atrasado = 5
}

export const SituacaoQuestionarioFornecedorLabel = new Map<number, string>([
  [SituacaoQuestionarioFornecedor.Pendente, 'Pendente'],
  [SituacaoQuestionarioFornecedor['Em Andamento'], 'Em Andamento'],
  [SituacaoQuestionarioFornecedor.Respondido, 'Respondido'],
  [SituacaoQuestionarioFornecedor.Atrasado, 'Atrasado']
]);
