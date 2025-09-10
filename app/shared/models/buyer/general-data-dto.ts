import { PerfilTributario, PorteEmpresa, SituacaoPessoaJuridica, TipoCadastroEmpresa } from '@shared/models';

export class GeneralDataDto {

  idPessoaJuridica: number;
  holding: boolean;
  filial: boolean;
  razaoSocial: string;
  nomeFantasia: string;
  dataCadastro: string;
  porte: PorteEmpresa;
  idNaturezaJuridica: number;
  numeroFuncionarios: number;
  tipoCadastro: TipoCadastroEmpresa;
  homePage: string;
  contato: string;
  telefone: string;
  email: string;
  perfilTributario: PerfilTributario;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  patrimonioLiquido: number;
  optanteSimplesNacional: boolean;
  capitalSocial: number;
  capitalIntegralizado: number;
  dataIntegralizacao: string;
  franquia: boolean;
  marcaFranquia: string;
  codigoFranquia: string;
  situacao: SituacaoPessoaJuridica;
  codigoFilialEmpresa: string;
  integracaoSapHabilitada: boolean;
  habilitarIntegracaoERP: boolean;

  constructor(init?: Partial<GeneralDataDto>) {
    Object.assign(this, init);
  }

}
