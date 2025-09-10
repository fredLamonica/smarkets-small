export enum SituacaoQuestionarioFornecedorCor {
  Pendente = 1,
  Andamento = 2,
  Respondido = 3
}

export const SituacaoQuestionarioFornecedorCorLabel = new Map<number, string>([
  [SituacaoQuestionarioFornecedorCor.Pendente, 'Pendentes'],
  [SituacaoQuestionarioFornecedorCor.Andamento, 'Em Andamento'],
  [SituacaoQuestionarioFornecedorCor.Respondido, 'Respondido']
]);
