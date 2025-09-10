
export class ListConfig {
  multiSelection: boolean;
  bindLabel: string;
  bindQuantityLabel: string;
  justifiedLabel: boolean;
  bindValue: string;
  noneSelectedIsAllSelected: boolean;
  allSelector: boolean;
  allSelectorText: string = 'Selecionar todos';
  emptyStateText: string = 'Nenhum registro disponível';
  parentKey: string;
  parentValue: string;
  parentSelectAllChildren: boolean;
  parentIsSelectable: boolean = true;
  textUppercase: boolean;

  constructor(init?: Partial<ListConfig>) {
    Object.assign(this, init);
  }
}
