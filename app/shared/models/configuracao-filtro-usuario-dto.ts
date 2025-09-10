import { FuncionalidadeConfiguracaoUsuario } from './enums/funcionalidade-configuracao-usuario.enum';

export class ConfiguracaoFiltroUsuarioDto {

  identificadorFuncionalidade: FuncionalidadeConfiguracaoUsuario;
  filtro: string;

  constructor(init?: Partial<ConfiguracaoFiltroUsuarioDto>) {
    Object.assign(this, init);
  }

}
