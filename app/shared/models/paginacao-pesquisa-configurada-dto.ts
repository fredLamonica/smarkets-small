import { ConfiguracaoColunaUsuarioDto } from './configuracao-coluna-usuario-dto';

export class PaginacaoPesquisaConfiguradaDto<T> {

  numeroPaginas: number;
  itens: Array<T>;
  total: number;
  configuracaoColunasUsuario: ConfiguracaoColunaUsuarioDto;

  constructor(init?: Partial<PaginacaoPesquisaConfiguradaDto<T>>) {
    Object.assign(this, init);
  }

}
