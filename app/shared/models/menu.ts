import { ItemMenu } from '.';

export class Menu {

  menuPrincipal: Array<ItemMenu>;
  menuLateral: Array<ItemMenu>;

  constructor(init?: Partial<Menu>) {
    Object.assign(this, init);
  }

}
