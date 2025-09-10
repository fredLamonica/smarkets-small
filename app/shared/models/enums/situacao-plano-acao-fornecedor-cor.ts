export enum SituacaoPlanoAcaoFornecedorCor {
  Atrasado = 1,
  Pendente = 2,
  Andamento = 3,
  Finalizado = 4
}

export const SituacaoPlanoAcaoFornecedorCorLabel = new Map<number, string>([
  [SituacaoPlanoAcaoFornecedorCor.Atrasado, 'Atrasado'],
  [SituacaoPlanoAcaoFornecedorCor.Pendente, 'Pendente'],
  [SituacaoPlanoAcaoFornecedorCor.Andamento, 'Em Andamento'],
  [SituacaoPlanoAcaoFornecedorCor.Finalizado, 'Finalizado']
]);
