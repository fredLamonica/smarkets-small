import { CategoriaProduto } from './../../categoria-produto';
import { CotacaoProposta } from './../cotacao-proposta';
import { Situacao } from '../../enums/situacao';
import { PessoaJuridica } from '../../pessoa-juridica';
import { Usuario } from '@shared/models/usuario';

export class CotacaoParticipanteMapaComparativoPorItem {
  public idCotacaoParticipante: number;
  public idCotacao: number;
  public dataInclusao: string;
  public idPessoaJuridica: number;
  public pessoaJuridica: PessoaJuridica;
  public situacao: Situacao;
  public aceitouTermos: boolean;
  public proposta: CotacaoProposta;
  public categoriasProduto: Array<CategoriaProduto>;
  public quantidadeItensCotados: number;
  public usuarioEnvioProposta: Usuario;
  public dataHoraEnvioProposta: string;
}