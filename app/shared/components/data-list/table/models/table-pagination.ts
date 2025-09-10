export class TablePagination {

  page: number;
  pageSize: number;

  constructor(init?: Partial<TablePagination>) {
    Object.assign(this, init);
  }

}
