import { GrupoCompradores } from '@shared/models';
import { CategoriaProduto } from '../categoria-produto';
import { MatrizUsuarioAlcada } from './matriz-usuario-alcada';
import { SlaItem } from '../sla/sla-item';
import { TipoRequisicao } from '../requisicao/tipo-requisicao';

export class MatrizResponsabilidade {
  public idMatrizResponsabilidade: number;
  public idTenant: number;
  public quantidadeMinimaPropostas: number;
  public categoriasProduto: Array<CategoriaProduto>;
  public tiposRequisicao: Array<TipoRequisicao>;
  public slaItens: Array<SlaItem>;
  public alcadas: Array<MatrizUsuarioAlcada>;
  public gruposCompradores: Array<GrupoCompradores>;
}
