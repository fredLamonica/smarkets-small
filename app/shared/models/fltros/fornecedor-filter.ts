import { OperadorDeComparacao } from '../enums/operador-de-comparacao.enum';
import { FiltroBase } from './base/filtro-base';

export class FornecedorFilter extends FiltroBase {

  razaoSocial: string;
  cnpj: string;
  nomeFantasia: string;
  idTenantCliente: number;
  operadorDeComparacao: OperadorDeComparacao;

  constructor(init?: Partial<FornecedorFilter>) {
    super();
    Object.assign(this, init);
  }

}
