export class ListChangeEvent<T> {
  selected: Array<T> | T;
  noneSelected: boolean;
  clearAllEvent: boolean;

  constructor(init?: Partial<ListChangeEvent<T>>) {
    Object.assign(this, init);
  }
}
