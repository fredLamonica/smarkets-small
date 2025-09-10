import { SituacaoPessoaJuridica } from './enums/situacao-pessoa-juridica';

export interface ListaPessoaJuridica {
  idPessoaJuridica: number;
  idPessoaJuridicaMatriz: number | null;
  codigoFilialEmpresa: string;
  situacao: SituacaoPessoaJuridica | null;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  holding: boolean;
  filial: boolean;
  franquia: boolean;
  pessoasJuridicasFilho: ListaPessoaJuridica[];
}
