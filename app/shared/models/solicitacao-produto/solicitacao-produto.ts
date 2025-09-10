import { SituacaoSolicitacaoProduto } from '@shared/models/enums/situacao-solicitacao-produto';
import { Usuario } from '..';
import { CategoriaProduto } from "../categoria-produto";
import { Moeda } from '../enums/moeda';
import { SolicitadoPor } from '../enums/solicitado-por';
import { TipoProduto } from '../enums/tipo-produto';
import { PessoaJuridica } from '../pessoa-juridica';
import { UnidadeMedida } from "../unidade-medida";
import { SolicitacaoProdutoComentario } from './solicitacao-produto-comentario';

export class SolicitacaoProduto {
  public idSolicitacaoProduto: number;
  public idTenant: number;

  public codigo: string;
  public situacao: SituacaoSolicitacaoProduto;
  public idCategoriaProduto: number;
  public categoriaProduto: CategoriaProduto;
  public tipoProduto: TipoProduto;
  public idUnidadeMedida: number;
  public idSlaSolicitacao: number;
  public unidadeMedida: UnidadeMedida;
  public contasContabeis: Array<any>;
  public contaSugerida: string;
  public marcas: Array<any>;
  public marcaSugerida: string;

  public descricao: string;
  public descricaoCompleta: string;
  public codigoNcm: string;
  public valorReferencia: number;
  public moeda: Moeda;
  public consumoMedio: number;
  public referenciaExterna: string;

  public imagens: Array<any>;
  public comentario: string;
  public comentarios: Array<SolicitacaoProdutoComentario>;
  public idEmpresaSolicitante: number;
  public empresaSolicitante: PessoaJuridica;
  public idUsuarioSolicitante: number;
  public usuarioSolicitante: Usuario;
  public idUsuarioResponsavel: number
  public usuarioResponsavel: Usuario;
  public solicitadoPor: SolicitadoPor;
  public dataCriacao: string;
}
