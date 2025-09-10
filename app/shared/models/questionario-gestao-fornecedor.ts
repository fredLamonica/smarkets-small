import {
  CategoriaFornecimento,
  QuestaoGestaoFornecedor,
  QuestionarioGestaoFornecedorCriterioAvaliacao,
  CategoriaQuestao
} from '.';

export class QuestionarioGestaoFornecedor {
  public idQuestionarioGestaoFornecedor: number;
  public nome: string;
  public dataInicio: Date;
  public dataFim: Date;
  public introducao: string;
  public questoes: Array<QuestaoGestaoFornecedor>;
  public categoriasQuestao: Array<CategoriaQuestao>;
  public categoriasFornecimento: Array<CategoriaFornecimento>;
  public criteriosAvaliacao: Array<QuestionarioGestaoFornecedorCriterioAvaliacao>;
  public usaTodasCategorias: boolean;
  public idTenant: number;
}
