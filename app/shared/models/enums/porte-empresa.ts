export enum PorteEmpresa {
  Pequeno = 1,
  MicroEmpresa = 2,
  Medio = 3,
  Grande = 4
}

export const PorteEmpresaDisplay = new Map<number, string>([
  [1, 'Pequeno'],
  [2, 'Microempresa'],
  [3, 'Médio'],
  [4, 'Grande']
]);
