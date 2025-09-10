import { QuestaoAvaliacaoFornecedor, CategoriaFornecimento } from '.';

export class AvaliacaoFornecedor {
  public idAvaliacaoFornecedor: number;
  public nome: string;
  public dataInicio: Date;
  public dataFim: Date;
  public introducao: string;
  public questoes: Array<QuestaoAvaliacaoFornecedor>;
  public categoriasFornecimento: Array<CategoriaFornecimento>;
  public idTenant: number;
  public stringCategorias: string;
}
