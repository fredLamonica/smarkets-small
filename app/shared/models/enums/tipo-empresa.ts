export enum TipoEmpresa {
  Convencional = 1,
  HoldingEmpresarial = 2
}

// para usar:
// TipoEmpresaDisplay.get(item).valueOf()

export const TipoEmpresaDisplay = new Map<number, string>([
  [1, 'Convencional'],
  [2, 'Holding Empresarial']
]);
