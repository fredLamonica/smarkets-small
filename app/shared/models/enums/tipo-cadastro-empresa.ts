export enum TipoCadastroEmpresa {
  Completo = 1,
  Simplificado = 2,
  Registrado = 3
}

export const TipoCadastroEmpresaDisplay = new Map<number, string>([
  [1, 'Pequeno'],
  [2, 'Microempresa'],
  [3, 'Médio'],
  [4, 'Grande']
]);
