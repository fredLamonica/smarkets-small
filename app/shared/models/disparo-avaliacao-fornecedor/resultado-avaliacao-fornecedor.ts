import { Usuario } from '../usuario';
import { SituacaoResultadoAvaliacaoFornecedor } from '../enums/situacao-resultado-avaliacao-fornecedor';
import { RespostaAvaliacaoFornecedor } from './resposta-avaliacao-fornecedor';
import { FornecedorInteressado } from '../fornecedor-interessado';
import { DisparoAvaliacaoFornecedor } from './disparo-avaliacao-fornecedor';

export class ResultadoAvaliacaoFornecedor {
  public idResultadoAvaliacaoFornecedor: number;
  public idDisparoAvaliacaoFornecedor: number;
  public idUsuarioAvaliador: number;
  public usuarioAvaliador: Usuario;
  public idFornecedorAvaliado: number;
  public situacao: SituacaoResultadoAvaliacaoFornecedor;
  public respostas: Array<RespostaAvaliacaoFornecedor>;
  public fornecedorAvaliado: FornecedorInteressado;
  public idTenant: number;
  public disparo: DisparoAvaliacaoFornecedor;
}
