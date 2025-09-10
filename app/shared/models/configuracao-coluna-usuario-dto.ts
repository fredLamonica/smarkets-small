import { ConfiguracaoColunaDto } from './configuracao-coluna-dto';
import { FuncionalidadeConfiguracaoUsuario } from './enums/funcionalidade-configuracao-usuario.enum';

export class ConfiguracaoColunaUsuarioDto {

  identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario;
  colunas: Array<ConfiguracaoColunaDto>;

  constructor(init?: Partial<ConfiguracaoColunaUsuarioDto>) {
    Object.assign(this, init);
  }

}
