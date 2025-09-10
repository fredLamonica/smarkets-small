import { Cidade } from './cidade';
import { TipoEndereco } from './enums/tipo-endereco';
import { Pessoa } from './pessoa';

export class Endereco {
  idEndereco: number;
  idPessoa: number;
  idPais: number;
  idEstado: number;
  idCidade: number;
  cidade: Cidade;
  cep: string;
  logradouro: string;
  numero: number;
  complemento: string;
  referencia: string;
  bairro: string;
  pessoa: Pessoa;
  principal: boolean;
  tipo: TipoEndereco;

  constructor(
    idEndereco: number,
    idPessoa: number,
    idPais: number,
    idEstado: number,
    idCidade: number,
    cidade: Cidade,
    cep: string,
    logradouro: string,
    numero: number,
    complemento: string,
    referencia: string,
    bairro: string,
    pessoa: Pessoa,
    principal: boolean,
    tipo: TipoEndereco,
  ) {
    this.idEndereco = idEndereco;
    this.idPessoa = idPessoa;
    this.idPais = idPais;
    this.idEstado = idEstado;
    this.idCidade = idCidade;
    this.cidade = cidade;
    this.cep = cep;
    this.logradouro = logradouro;
    this.numero = numero;
    this.complemento = complemento;
    this.referencia = referencia;
    this.bairro = bairro;
    this.pessoa = pessoa;
    this.principal = principal;
    this.tipo = tipo;
  }
}
