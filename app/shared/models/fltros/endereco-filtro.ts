import { TipoEndereco } from '../enums/tipo-endereco';
import { FiltroBase } from './base/filtro-base';

export class EnderecoFiltro extends FiltroBase {

  termo: string;
  idPessoa: number;
  tipoEndereco?: TipoEndereco;

  constructor(init?: Partial<EnderecoFiltro>) {
    super();
    Object.assign(this, init);
  }
}
