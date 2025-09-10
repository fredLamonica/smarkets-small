import { SituacaoCampanha } from '.';
import { FormGroup } from '@angular/forms';''

interface ICampanhaFranquia {
  idCampanhaFranquia: number;
  titulo: string;
  status: SituacaoCampanha;
  ano: number;
  semestre: number;
  dataInicio: Date;
  dataFim: Date;
  dataLimiteAceite: Date;
  dataLimiteComprovacao: Date;
  dataLimiteAprovacao: Date;
  dataLimiteNotaDebito: Date;
  dataLimitePagamento: Date;
  termoCondicoes: string;
  idTenant: number;
  idArquivoPolitica: number;
  idArquivoVerba:number;
}

export interface IFormGroupCampanhaFranquia extends FormGroup {
  value: ICampanhaFranquia
}

export class CampanhaFranquia {
  public idCampanhaFranquia: number;
  public titulo: string;
  public status: SituacaoCampanha;
  public ano: number;
  public semestre: number;
  public dataInicio: Date;
  public dataFim: Date;
  public dataLimiteAceite: Date;
  public dataLimiteComprovacao: Date;
  public dataLimiteAprovacao: Date;
  public dataLimiteNotaDebito: Date;
  public dataLimitePagamento: Date;
  public termoCondicoes: string;
  public idTenant: number;
  public idArquivoPolitica: number;
  public idArquivoVerba:number;
  public dataExclusao: Date;
  public idArquivoVerbas:number;
  public cicloEncerrado: boolean;

  constructor(
    idCampanhaFranquia: number,
    titulo: string,
    status: SituacaoCampanha,
    ano: number,
    semestre: number,
    dataInicio: Date,
    dataFim: Date,
    dataLimiteAceite: Date,
    dataLimiteComprovacao: Date,
    dataLimiteAprovacao: Date,
    dataLimiteNotaDebito: Date,
    dataLimitePagamento: Date,
    termoCondicoes: string,
    idTenant: number,
    idArquivoPolitica: number,
    idArquivoVerba: number,
    dataExclusao: Date,
    idArquivoVerbas:number,
    cicloEncerrado : boolean,
  ) {
    this.idCampanhaFranquia = idCampanhaFranquia;
    this.titulo = titulo;
    this.status = status;
    this.ano = ano;
    this.semestre = semestre;
    this.dataInicio = dataInicio;
    this.dataFim = dataFim;
    this.dataLimiteAceite = dataLimiteAceite;
    this.dataLimiteComprovacao = dataLimiteComprovacao;
    this.dataLimiteAprovacao = dataLimiteAprovacao;
    this.dataLimiteNotaDebito = dataLimiteNotaDebito;
    this.dataLimitePagamento = dataLimitePagamento;
    this.termoCondicoes = termoCondicoes;
    this.idTenant = idTenant;
    this.idArquivoPolitica = idArquivoPolitica;
    this.idArquivoVerba = idArquivoVerba;
    this.dataExclusao = dataExclusao;
    this.idArquivoVerbas = idArquivoVerbas;
    this.cicloEncerrado = cicloEncerrado;
  }
}
