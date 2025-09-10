import { TipoValidacaoDeConta } from '../../../components/smk-validacao-de-conta/models/tipo-validacao-de-conta.enum';

export class CodigoVerificacaoDto {

  tipo: TipoValidacaoDeConta;
  emailNovo: string;

  constructor(init?: Partial<CodigoVerificacaoDto>) {
    Object.assign(this, init);
  }

}
