import { StatusFornecedor } from '..';
import { TermoBoasPraticas } from '../enums/termo-boas-praticas';

export class InfosFornecedor {
  idFornecedor: number;
  razaoSocial: string;
  cnpj: string;
  status: StatusFornecedor;
  dataCadastro: Date;
  aceitouTermo: TermoBoasPraticas;
  dataAceite: Date;
  possuiCategoriaFornecimentoInteresse: boolean;
  centralizaHomologacao: boolean;
  idTenant: number;
}
