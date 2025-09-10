export class ConfigTableFerramentas {

  exibirExportar: boolean = true;
  exibirConfigurarColunas: boolean = true;

  constructor(init?: Partial<ConfigTableFerramentas>) {
    Object.assign(this, init);
  }

  get exibirFerramentas(): boolean {
    return this.exibirExportar || this.exibirConfigurarColunas;
  }

}
