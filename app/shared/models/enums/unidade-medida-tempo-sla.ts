export enum UnidadeMedidaTempoSla {
  'Hora(s)' = 1,
  'Dia(s)' = 2,
}

export const UnidadeTempoSlaDisplay = new Map<number, string>([
  [1, 'Hora(s)'],
  [2, 'Dia(s)'],
]);
