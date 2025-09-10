import { Situacao } from '.';
import { PessoaJuridica } from './pessoa-juridica';
import { StatusHomologacaoTransportadora } from './enums/status-homologacao-transportadora.enum';

export class Transportadora {
  public idTransportadora: number;
  public idTenant: number;
  public cnpj: string;
  public razaoSocial: string;
  public nomeFantasia: string;
  public idPessoaJuridica: number;
  public pessoaJuridica: PessoaJuridica;
  public contato: string;
  public email: string;
  public telefone: string;
  public codigoTransportadora: string;
  public situacao: Situacao;
  public statusHomologacao: StatusHomologacaoTransportadora;

  constructor() {}
}
