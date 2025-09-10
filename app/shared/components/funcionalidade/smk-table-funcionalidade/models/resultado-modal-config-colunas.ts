import { ConfiguracaoColunaDto } from '../../../../models/configuracao-coluna-dto';

export class ResultadoModalConfigColunas {

  colunasConfiguradas?: Array<ConfiguracaoColunaDto>;
  resetarConfiguracao?: boolean;

  constructor(init?: Partial<ResultadoModalConfigColunas>) {
    Object.assign(this, init);
  }

}
