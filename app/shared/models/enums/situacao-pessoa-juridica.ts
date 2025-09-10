export enum SituacaoPessoaJuridica {
  Ativa = 1,
  Inativa = 2,
  Pendente = 3
}

export const SituacaoPessoaJuridicaLabel = new Map<number, string>([
  [1, 'Ativa'],
  [2, 'Inativa'],
  [3, 'Em Configuração']
]);
