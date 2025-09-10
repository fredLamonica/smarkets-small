import { TipoQuestao } from '../enums/tipo-questao';
import { RespostaAvaliacaoFornecedorComentario } from './resposta-avaliacao-fornecedor-comentario';
import { OpcaoRespostaAvaliacaoFornecedor } from './opcao-resposta-avaliacao-fornecedor';

export class RespostaAvaliacaoFornecedor {
  public idRespostaAvaliacaoFornecedor: number;
  public idResultadoAvaliacaoFornecedor: number;
  public idQuestaoAvaliacaoFornecedor: number;
  public pergunta: string;
  public notaExplicativa: string;
  public tipo: TipoQuestao;
  public resposta: string;
  public valor: number;
  public permiteComentario: boolean;
  public comentario: RespostaAvaliacaoFornecedorComentario;
  public opcoes: Array<OpcaoRespostaAvaliacaoFornecedor>;
  public idTenant: number;
}
