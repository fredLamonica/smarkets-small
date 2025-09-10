export enum TipoOrganizacao {
  Franquia = 1,
  Matriz = 2
}

// para usar:
// TipoOrganizacaoDisplay.get(item).valueOf()

export const TipoOrganizacaoDisplay = new Map<number, string>([
  [1, 'Franquia'],
  [2, 'Matriz']
]);
