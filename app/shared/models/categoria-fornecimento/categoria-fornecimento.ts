import { SolicitacaoDocumentoFornecedor } from '../solicitacao-documento-fornecedor';

export class CategoriaFornecimento {
  public idCategoriaFornecimento: number;
  public codigo: string;
  public descricao: string;
  public idTenant: number;
  public solicitacoesDocumentosFornecedor: Array<SolicitacaoDocumentoFornecedor>;

  constructor(
    idCategoriaFornecimento?: number,
    codigo?: string,
    descricao?: string,
    idTenant?: number
  ) {
    this.idCategoriaFornecimento = idCategoriaFornecimento;
    this.codigo = codigo;
    this.descricao = descricao;
    this.idTenant = idTenant;
  }
}
