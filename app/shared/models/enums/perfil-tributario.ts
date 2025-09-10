export enum PerfilTributario {
  LucroPresumido = 1,
  LucroReal = 2
}

export const PerfilTributarioDisplay = new Map<number, string>([
  [1, 'Lucro Presumido'],
  [2, 'Lucro Real']
]);
