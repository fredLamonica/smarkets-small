import { CategoriaQuestao } from '@shared/models/categoria-questao';
import { TipoQuestao } from './enums/tipo-questao';
import { RespostaMultiplaEscolhaFornecedor } from '.';

export class QuestaoGestaoFornecedor {
  public idQuestaoGestaoFornecedor: number;
  public idQuestionarioGestaoFornecedor: number;
  public peso: number;
  public tipo: TipoQuestao;
  public descricao: string;
  public notaExplicativa: string;
  public permiteComentario: boolean;
  public respostas: Array<RespostaMultiplaEscolhaFornecedor>;
  public idTenant: number;
  public idCategoriaQuestao: number;
  public categoriaQuestao: CategoriaQuestao;
}
