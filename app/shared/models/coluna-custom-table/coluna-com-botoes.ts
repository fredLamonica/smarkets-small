import { BotaoCustomTable } from '..';

export class ColunaComBotoes {
  titulo: string;
  botoes: Array<BotaoCustomTable>;

  constructor(init?: Partial<ColunaComBotoes>) {
    Object.assign(this, init);
  }
}
