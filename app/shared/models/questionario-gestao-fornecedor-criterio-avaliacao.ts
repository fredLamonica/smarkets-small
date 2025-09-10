import { Situacao } from '.';

export class QuestionarioGestaoFornecedorCriterioAvaliacao {
  public idQuestionarioGestaoFornecedorCriterioAvaliacao: number;
  public idQuestionarioGestaoFornecedor: number;
  public descricao: string;
  public notaInicio: number;
  public notaFim: number;
  public situacao: Situacao;
}
