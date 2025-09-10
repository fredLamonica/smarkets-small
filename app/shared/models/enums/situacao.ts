export enum Situacao {
  Ativo = 1,
  Inativo = 2,
  ["Aguardando Exclusão"] = 3,
  ["Aguardando Inclusão"] = 4,
}

export const SituacaoLabel = new Map<number, string>([
  [1, 'Ativo'],
  [2, 'Inativo']
]);
