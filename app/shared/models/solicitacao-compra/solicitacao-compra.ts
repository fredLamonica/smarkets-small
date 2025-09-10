import { ItemSolicitacaoCompra } from './item-solicitacao-compra';
import { SituacaoSolicitacaoCompra } from '../enums/situacao-solicitacao-compra';
import { TipoRequisicao } from '../requisicao/tipo-requisicao';
import { Usuario } from '../usuario';

export class SolicitacaoCompra {
  public idSolicitacaoCompra: number;
  public idTenant: number;
  public codigo: string;
  public tipoDocumento: string;
  public descricao: string;
  public usuarioRequisitante: string;
  public nomeRequisitante: string;
  public departamento: string;
  public emailRequisitante: string;
  public telefoneRequisitante: string;
  public ramalRequisitante: string;
  public dataCriacao: string;
  public dataImportacao: string;
  public situacao: SituacaoSolicitacaoCompra;
  public itens: Array<ItemSolicitacaoCompra>;
  public tipoRequisicao: TipoRequisicao;
  public usuario: Usuario;
  public dataLiberacaoRc: Date;
  public tpDoc: string;
}
