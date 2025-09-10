import {
  SolicitacaoDocumentoFornecedor,
  Arquivo,
  StatusSolicitacaoDocumentoFornecedor,
  SituacaoValidacaoDocumentoFornecedor,
  DocumentoFornecedor,
  SolicitacaoDocumentoFornecedorValidacao,
  PessoaJuridica
} from '@shared/models';
import { DocumentoFornecedorDto } from './dto/documento-fornecedor-dto';

export class SolicitacaoDocumentoFornecedorArquivo {
  public idSolicitacaoDocumentoFornecedorArquivo: number;
  public idSolicitacaoDocumentoFornecedor: number;
  public idDocumentoFornecedor: number;
  public solicitacaoDocumentoFornecedor: SolicitacaoDocumentoFornecedor;
  public documentoFornecedor: DocumentoFornecedorDto;
  public idPessoaJuridicaFornecedor: number;
  public fornecedor: PessoaJuridica;
  public idArquivo: number;
  public arquivo: Arquivo;
  public statusSolicitacaoDocumentoFornecedor: StatusSolicitacaoDocumentoFornecedor;
  public dataInclusao: Date;
  public dataVencimento: Date;
  public validacaoArquivo: SolicitacaoDocumentoFornecedorValidacao;
  public antigaDataVencimento: Date;
}
