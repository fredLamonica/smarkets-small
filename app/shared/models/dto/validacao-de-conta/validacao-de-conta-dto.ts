import { TipoValidacaoDeConta } from '../../../components/smk-validacao-de-conta/models/tipo-validacao-de-conta.enum';

export class ValidacaoDeContaDto {

  tipo: TipoValidacaoDeConta;
  codigo: string;

  constructor(init?: Partial<ValidacaoDeContaDto>) {
    Object.assign(this, init);
  }

}
