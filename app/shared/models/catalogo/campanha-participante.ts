import { PessoaJuridica, Situacao, Endereco } from '@shared/models';

export class CampanhaParticipante {
  public idCampanhaParticipante: number;
  public idCampanha: number;
  public idPessoaJuridica: number;
  public pessoaJuridica: PessoaJuridica;
  public situacao: Situacao;
  public dataAdesao: string;
  public cnpj: string;
  public razaoSocial: string;
  public nomeResponsavel: string;
  public emailResponsavel: string;
  public nomeRequisitante: string;
  public emailRequisitante: string;
  public nomeAprovador: string;
  public emailAprovador: string;
  public telefoneResponsavel: string;
  public celularResponsavel: string;
  public indicacao: string;
  public idPais: number;
  public idEstado: number;
  public idCidade: number;
  public cep: string;
  public logradouro: string;
  public numero: number;
  public complemento: string;
  public referencia: string;
  public bairro: string;
}
