import { SituacaoQuestionarioFornecedor, RespostaGestaoFornecedor } from '.';

export class ResultadoQuestionarioFornecedor {
  public idResultadoQuestionarioFornecedor: number;
  public idQuestionarioGestaoFornecedor: number;
  public nomeQuestionario: string;
  public introducao: string;
  public dataCriacao?: Date;
  public situacao: SituacaoQuestionarioFornecedor;
  public respostas: Array<RespostaGestaoFornecedor>;
  public notaQuestionario: number;
  public avaliacaoQuestionario: string;
  public idTenant: number;
}
