import {
  TipoQuestao,
  RespostaGestaoFornecedorComentario,
  RespostaMultiplaEscolhaFornecedor
} from '.';
import { CategoriaQuestao } from './categoria-questao';

export class RespostaGestaoFornecedor {
  public idRespostaGestaoFornecedor: number;
  public idResultadoQuestionarioFornecedor: number;
  public idQuestaoGestaoFornecedor: number;
  public pergunta: string;
  public notaExplicativa: string;
  public tipo: TipoQuestao;
  public resposta: string;
  public valor?: number;
  public permiteComentario: boolean;
  public comentario: RespostaGestaoFornecedorComentario;
  public opcoes: Array<RespostaMultiplaEscolhaFornecedor>;
  public idCategoriaQuestao: number;
  public categoriaQuestao: CategoriaQuestao;
  public peso: number;
}
