import { SituacaoPessoaJuridica } from './enums/situacao-pessoa-juridica';

export class PessoaJuridicaDto {

  idTenant: number;
  idPessoaJuridica: number;
  idTenantPai: number;
  idPessoaJuridicaMatriz: number;
  situacao: SituacaoPessoaJuridica;
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  holding: boolean;
  filial: boolean;
  franquia: boolean;
  pessoasJuridicasFilho: Array<PessoaJuridicaDto>;
  codigoFilialEmpresa: string;

  constructor(init?: Partial<PessoaJuridicaDto>) {
    Object.assign(this, init);
  }

}
