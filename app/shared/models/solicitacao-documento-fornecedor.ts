import { CategoriaFornecimento } from '.';
import { DocumentoFornecedorDto } from './dto/documento-fornecedor-dto';
import { PessoaJuridica } from './pessoa-juridica';

export class SolicitacaoDocumentoFornecedor {
  public idSolicitacaoDocumentoFornecedor: number;
  public idTenant: number;
  public solicitante: PessoaJuridica;
  public idDocumentoFornecedor: number;
  public documentoFornecedor: DocumentoFornecedorDto;
  public categoriasFornecimento: Array<CategoriaFornecimento>;
}
