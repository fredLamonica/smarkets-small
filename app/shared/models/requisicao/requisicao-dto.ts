import { SituacaoRequisicaoItem } from '../enums/situacao-requisicao-item';

export class RequisicaoDto {

  idRequisicao: number;
  idRequisicaoItem: number;
  produto: string;
  situacao: SituacaoRequisicaoItem;
  dataCriacao: string;
  slaPausa: boolean;
  dataInicioContagem: string;
  dataFinalSla: string;
  clienteSolicitante: string;
  codigoProduto: string;
  marca: string;
  valorReferencia: number;
  quantidadeSolicitada: number;
  centroCusto: string;
  idUsuarioResponsavelCentroCusto: number;
  contaContabil: string;
  tipo: string;
  idUsuarioResponsavel: number;
  usuarioResponsavel: string;
  usuarioSolicitante: string;
  dataAprovacao: string;
  usuarioAprovador: string;
  classificacaoSla: string;
  clienteEntrega: string;
  cnpjEntrega: string;
  centro: string;
  enderecoEntrega: string;
  codigoRc: string;
  idChamado: string;
  idTenant: number;

  constructor(init?: Partial<RequisicaoDto>) {
    Object.assign(this, init);
  }

}
