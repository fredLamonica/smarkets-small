import { DualListColumn } from './dual-list-column';

export class DualListConfig<T> {
  name: string;
  sourceTitle: string;
  destinationTitle: string;
  columns: DualListColumn[];
  searchCompareTo: Function;
  compareTo: Function;

  constructor(init?: Partial<DualListConfig<T>>) {
    Object.assign(this, init);
  }
}
