export enum SituacaoCampanha {
  "Em Configuração" = 1,
  "Ativa"           = 2,
  "Inativa"         = 3
}

export const SituacaoCampanhaLabel = new Map<number, string>([
  [1, 'Em Configuração'],
  [2, 'Ativa'],
  [3, 'Inativa']
]);
