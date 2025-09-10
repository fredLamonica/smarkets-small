import { StatusFornecedor } from './enums/status-fornecedor';
import { OrigemFornecedor } from './enums/origem-fornecedor';
import { CategoriaFornecimento, GrupoContas, SituacaoPessoaJuridica, Usuario } from '.';
import { PessoaJuridica } from './pessoa-juridica';
import { CategoriaFornecimentoInteresse } from './categoria-fornecimento/categoria-fornecimento-interesse';
import { SituacaoDocumentoFornecedorCor } from './enums/situacao-documento-fornecedor-cor';
import { SituacaoPlanoAcaoFornecedorCor } from './enums/situacao-plano-acao-fornecedor-cor';
import { SituacaoPendenciaFornecedorCor } from './enums/situacao-pendencia-fornecedor-cor';
import { SituacaoQuestionarioFornecedorCor } from './enums/situacao-questionario-fornecedor-cor';

export class FornecedorInteressado {
  public idFornecedor: number;
  public idPessoaJuridicaFornecedor: number;
  public idTenant: number;
  public origem: OrigemFornecedor;
  public idUsuario: number;
  public usuario: Usuario;
  public cnpj: string;
  public razaoSocial: string;
  public pessoaJuridica: PessoaJuridica;
  public nomeFantasia: string;
  public categoriasFornecimento: Array<CategoriaFornecimento>;
  public contato: string;
  public email: string;
  public aceitarTermo: boolean;
  public status: StatusFornecedor;
  public codigoFornecedor: string;
  public grupoContas: GrupoContas;
  public possuiCategoriaFornecimentoInteresse: boolean;
  public categoriaFornecimentoInteresses: Array<CategoriaFornecimentoInteresse>;
  public situacaoPessoaJuridica: SituacaoPessoaJuridica;
  public qtdDoc: number;
  public qtdPNL: number;
  public qtdPDC: number;
  public qtdQST: number;
  public situacaoDocumentoFornecedorCor: SituacaoDocumentoFornecedorCor;
  public situacaoPlanoAcaoFornecedorCor: SituacaoPlanoAcaoFornecedorCor;
  public situacaoPendenciaFornecedorCor: SituacaoPendenciaFornecedorCor;
  public situacaoQuestionarioFornecedorCor: SituacaoQuestionarioFornecedorCor;


  constructor(
    idFornecedor: number,
    idPessoaJuridicaFornecedor: number,
    idTenant: number,
    origem: OrigemFornecedor,
    idUsuario: number,
    cnpj: string,
    razaoSocial: string,
    nomeFantasia: string,
    aceitarTermo: boolean,
    status: StatusFornecedor,
    pessoaJuridica?: PessoaJuridica,
    codigoFornecedor?: string
  ) {
    this.idFornecedor = idFornecedor;
    this.idPessoaJuridicaFornecedor = idPessoaJuridicaFornecedor;
    this.idTenant = idTenant;
    this.origem = origem;
    this.idUsuario = idUsuario;
    this.cnpj = cnpj;
    this.razaoSocial = razaoSocial;
    this.nomeFantasia = nomeFantasia;
    this.aceitarTermo = aceitarTermo;
    this.status = status;
    if (pessoaJuridica) this.pessoaJuridica = pessoaJuridica;
    if (codigoFornecedor) this.codigoFornecedor = codigoFornecedor;
  }
}
