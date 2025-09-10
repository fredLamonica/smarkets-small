import { TipoQuestao, RespostaMultiplaEscolhaAvaliacaoFornecedor } from '.';

export class QuestaoAvaliacaoFornecedor {
  public idQuestaoAvaliacaoFornecedor: number;
  public idAvaliacaoFornecedor: number;
  public peso: number;
  public tipo: TipoQuestao;
  public descricao: string;
  public notaExplicativa: string;
  public permiteComentario: boolean;
  public respostas: Array<RespostaMultiplaEscolhaAvaliacaoFornecedor>;
  public idTenant: number;

  constructor(
    idQuestaoAvaliacaoFornecedor?: number,
    idAvaliacaoFornecedor?: number,
    peso?: number,
    tipo?: TipoQuestao,
    descricao?: string,
    notaExplicativa?: string,
    permiteComentario?: boolean,
    respostas?: Array<RespostaMultiplaEscolhaAvaliacaoFornecedor>,
    idTenant?: number
  ) {
    this.idQuestaoAvaliacaoFornecedor = idQuestaoAvaliacaoFornecedor;
    this.idAvaliacaoFornecedor = idAvaliacaoFornecedor;
    this.peso = peso;
    this.tipo = tipo;
    this.descricao = descricao;
    this.notaExplicativa = notaExplicativa;
    this.permiteComentario = permiteComentario;
    this.respostas = respostas;
    this.idTenant = idTenant;
  }
}
