import { ListConfig } from '../../list/models/list-config';

export class ListContainerConfig {
  header: string;
  listConfig: ListConfig;
  collapsedItemsToDisplay?: number;
  expandedMaxHeightPx?: string;
  labelExpand: string;
  labelCollapse: string;

  constructor(init?: Partial<ListContainerConfig>) {
    Object.assign(this, init);
  }
}
