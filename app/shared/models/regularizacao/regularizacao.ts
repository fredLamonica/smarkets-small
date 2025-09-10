import { CentroCusto } from '../centro-custo';
import { CondicaoPagamento } from '../condicao-pagamento';
import { ContaContabil } from '../conta-contabil';
import { Endereco } from '../endereco';
import { Moeda } from '../enums/moeda';
import { SituacaoRegularizacao } from '../enums/situacao-regularizacao.enum';
import { TipoFrete } from '../enums/tipo-frete';
import { GrupoCompradores } from '../grupo-compradores';
import { Pedido } from '../pedido/pedido';
import { PessoaJuridica } from '../pessoa-juridica';
import { Usuario } from '../usuario';
import { RegularizacaoAnexo } from './regularizacao-anexo';
import { RegularizacaoItem } from './regularizacao-item';

export class Regularizacao {

  idRegularizacao: number;
  idTenant: number;
  idEmpresaSolicitante: number;
  empresaSolicitante: PessoaJuridica;
  idUsuario: number;
  usuario: Usuario;
  dataCriacao: string;
  moeda: Moeda;
  situacao: SituacaoRegularizacao;
  itens: Array<RegularizacaoItem>;
  idEnderecoEntrega?: number;
  enderecoEntrega: Endereco;
  idCentroCusto?: number;
  centroCusto: CentroCusto;
  idCondicaoPagamento?: number;
  condicaoPagamento: CondicaoPagamento;
  idGrupoCompradores?: number;
  grupoCompradores: GrupoCompradores;
  observacao: string;
  anexos: Array<RegularizacaoAnexo>;
  idAlcada?: number;
  frete: TipoFrete;
  idPessoaJuridicaFornecedor?: number;
  fornecedor: PessoaJuridica;
  idPedido?: number;
  pedido: Pedido;
  ultimaAlteracao: string;
  idContaContabil: number;
  contaContabil: ContaContabil;
  habilitarBtnRemover: boolean = false;
  selecionarTodos: boolean = false;

  constructor(init?: Partial<Regularizacao>) {
    Object.assign(this, init);
  }
}
