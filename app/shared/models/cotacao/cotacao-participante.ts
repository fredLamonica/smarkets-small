import { Endereco } from './../endereco';
import { CategoriaProduto } from './../categoria-produto';
import { CotacaoProposta } from './cotacao-proposta';
import { Situacao } from '../enums/situacao';
import { PessoaJuridica } from '../pessoa-juridica';
import { TipoEndereco } from '../enums/tipo-endereco';

export class CotacaoParticipante {
  public idCotacaoParticipante: number;
  public idCotacao: number;
  public dataInclusao: string;
  public idPessoaJuridica: number;
  public pessoaJuridica: PessoaJuridica;
  public situacao: Situacao;
  public aceitouTermos: boolean;
  public proposta: CotacaoProposta;
  public categoriasProduto: Array<CategoriaProduto>;

  public enderecoInstitucional: Endereco;
  public quantidadeArquivoAnexado: number;
  public nomeUsuarioVisualizouCotacaoRodadaAtual: string;
  public dataVisualizacaoCotacaoRodadaAtual: Date;
  public nomeUsuarioCotouCotacaoRodadaAtual: string;
  public dataEnvioPropostaCotacaoRodadaAtual: Date;

  constructor(
    idCotacaoParticipante: number,
    idCotacao: number,
    dataInclusao: string,
    idPessoaJuridica: number,
    pessoaJuridica: PessoaJuridica,
    situacao: Situacao,
    aceitouTermos: boolean,
    categoriasProduto: Array<CategoriaProduto>
  ) {
    this.idCotacaoParticipante = idCotacaoParticipante;
    this.idCotacao = idCotacao;
    this.dataInclusao = dataInclusao;
    this.idPessoaJuridica = idPessoaJuridica;
    this.pessoaJuridica = pessoaJuridica;
    this.situacao = situacao;
    this.aceitouTermos = aceitouTermos;
    this.categoriasProduto = categoriasProduto;
  }
}
