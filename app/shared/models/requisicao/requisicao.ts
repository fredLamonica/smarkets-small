import { SituacaoRequisicao } from '@shared/models/enums/situacao-requisicao';
import { CentroCusto, CondicaoPagamento, ContaContabil, Departamento, Endereco, GrupoCompradores, SlaItem, TipoRequisicao, Usuario } from '..';
import { CategoriaProduto } from '../categoria-produto';
import { Moeda } from '../enums/moeda';
import { PessoaJuridica } from '../pessoa-juridica';
import { RequisicaoAnexo } from './requisicao-anexo';
import { RequisicaoItem } from './requisicao-item';

export class Requisicao {
  idRequisicao: number;
  idCategoriaProduto: number;
  categoriaProduto: CategoriaProduto;
  idTenant: number;
  idEmpresaSolicitante: number;
  empresaSolicitante: PessoaJuridica;
  idUsuarioSolicitante: number;
  usuarioSolicitante: Usuario;
  itens: Array<RequisicaoItem>;
  dataCriacao: string;
  moeda: Moeda;
  situacao: SituacaoRequisicao;
  isFavorita: boolean;
  idEnderecoEntrega: number;
  enderecoEntrega: Endereco;
  idCentroCusto: number;
  centroCusto: CentroCusto;
  idTipoRequisicao: number;
  tipoRequisicao: TipoRequisicao;
  idSlaItem: number;
  slaItem: SlaItem;
  idCondicaoPagamento: number;
  condicaoPagamento: CondicaoPagamento;
  ultimaAlteracao: string;
  idGrupoCompradores: number;
  grupoCompradores: GrupoCompradores;
  idContaContabil: number;
  contaContabil: ContaContabil;
  anexos: Array<RequisicaoAnexo>;
  imobilizado: boolean;
  codigoImobilizado: string;
  idDepartamento: number;
  departamento: Departamento;
  habilitarBtnRemover: boolean = false;
  selecionarTodos: boolean = false;

  constructor(init?: Partial<Requisicao>) {
    Object.assign(this, init);
  }
}
